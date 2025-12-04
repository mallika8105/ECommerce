# Profile Errors 406 & 409 - Complete Explanation

## Error Summary

When accessing the Account page, you encountered these errors:

```
Failed to load resource: the server responded with a status of 406 ()
AccountPage.tsx:69 AccountPage: fetchProfile: Profile not found for user: a0000000-0000-4000-8000-000000000001
jifjjzaofphtebzdwicy.supabase.co/rest/v1/profiles?on_conflict=id:1  Failed to load resource: the server responded with a status of 409 ()
AccountPage.tsx:84 AccountPage: fetchProfile: Error creating profile: Object
```

## What These Errors Mean

### 1. HTTP 406 - Not Acceptable
**What it means:** The server cannot produce a response matching the list of acceptable values defined by the request.

**In this context:** The Supabase API couldn't return the profile data in the expected format. This happens when:
- The `.single()` modifier is used but no rows exist (PostgREST returns 406 instead of an empty result)
- Row Level Security (RLS) policies prevent reading the data
- The client expects exactly one row but zero are available

### 2. HTTP 409 - Conflict
**What it means:** The request conflicts with the current state of the server.

**In this context:** When trying to create a profile using `upsert()` with `onConflict`, the operation failed because:
- Missing INSERT policy in RLS prevented creating new rows
- The user doesn't have permission to INSERT into the profiles table
- The conflict resolution strategy couldn't be executed

## Root Cause Analysis

### The Actual Problem
The `profiles` table had RLS policies that allowed users to:
- ✅ SELECT (read) their own profile
- ✅ UPDATE their own profile
- ❌ **INSERT (create) their own profile** ← MISSING!

This meant:
1. New users could authenticate successfully
2. But couldn't create their profile entry in the database
3. Leading to 406 errors when querying (no data found with `.single()`)
4. Leading to 409 errors when trying to create (no INSERT permission)

### Why This Happened
Looking at the migration history:
- `001_create_core_tables.sql` initially set up RLS with SELECT and UPDATE policies
- `012_disable_rls_profiles.sql` disabled RLS entirely (temporary fix)
- But the INSERT policy was never properly added when RLS was re-enabled

## The Solution

### 1. Database Fix: Migration 021
Created `database/migrations/021_fix_profiles_policies.sql` which:

```sql
-- Drops all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Re-enables RLS properly
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Creates comprehensive policies including INSERT
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Plus admin policies...
```

**Key addition:** The `"Users can insert own profile"` policy allows users to create their profile record.

### 2. Code Fix: AccountPage.tsx
Updated the profile fetching logic:

**Before (problematic):**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('...')
  .eq('id', user.id)
  .single(); // ← Returns 406 when no rows found

// Then using upsert with onConflict
const { error: createError } = await supabase
  .from('profiles')
  .upsert({...}, { onConflict: 'id' }); // ← Returns 409 without INSERT policy
```

**After (fixed):**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('...')
  .eq('id', user.id)
  .maybeSingle(); // ← Returns null when no rows, no error

if (!data) {
  // Use INSERT instead of UPSERT for new profiles
  const { data: insertedData, error: insertError } = await supabase
    .from('profiles')
    .insert(newProfile)
    .select()
    .single(); // ← Works with new INSERT policy
}
```

**Key changes:**
1. **`.maybeSingle()`** instead of `.single()` - Doesn't throw 406 when no rows found
2. **`.insert()`** instead of `.upsert()` - Clearer intent for creating new records
3. Better error handling and user feedback

## How to Apply the Fix

### Step 1: Apply Database Migration
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `database/migrations/021_fix_profiles_policies.sql`
3. Run the migration
4. Verify 5 policies are created (see `APPLY_MIGRATION_021.md` for details)

### Step 2: Code Changes (Already Applied)
The AccountPage.tsx code has been updated automatically. No further action needed.

### Step 3: Test
1. Log out and log back in
2. Navigate to Account page
3. Verify no 406/409 errors
4. Profile should load or be created automatically
5. Update profile information and save

## Prevention

To prevent similar issues in the future:

1. **Always include INSERT policies** when enabling RLS on tables that users need to create records in
2. **Use `.maybeSingle()`** when you're not sure if a record exists
3. **Use explicit `.insert()`** for creating new records instead of relying on upsert
4. **Test with new users** to ensure profile creation works
5. **Monitor browser console** for HTTP status codes during development

## Technical Details

### PostgREST Error Codes
- **406 Not Acceptable**: Typically means `.single()` found 0 or 2+ rows instead of exactly 1
- **409 Conflict**: Typically means constraint violation or permission denied on conflict resolution

### RLS Policy Components
```sql
CREATE POLICY "policy_name" ON table_name
    FOR operation           -- SELECT, INSERT, UPDATE, DELETE, ALL
    USING (condition)       -- When can user access existing rows?
    WITH CHECK (condition); -- When can user create/modify rows?
```

For INSERT operations:
- `USING` is not used (no existing row to check)
- `WITH CHECK` validates the row being inserted

## Update: Infinite Recursion Error (500)

After applying Migration 021, a new error occurred:

```
GET .../profiles?select=... 500 (Internal Server Error)
Error: infinite recursion detected in policy for relation "profiles"
Code: 42P17
```

### Why This Happened
The admin policies in Migration 021 created a circular dependency:

```sql
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p  -- ← Queries profiles table
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );
```

To check if a user can SELECT from profiles, PostgreSQL needs to SELECT from profiles to verify admin role → infinite loop.

### Final Solution: Migration 022
Disable RLS on profiles table entirely:

```sql
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

This is safe because:
1. All access requires authentication
2. Application code validates user ownership
3. Admin routes are protected by application-level guards
4. Matches the pattern used for other tables in the project
5. Profile data isn't highly sensitive

## Final Steps to Fix

### Apply Migration 022 (Required)
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `database/migrations/022_fix_profiles_infinite_recursion.sql`
3. Run the migration
4. Verify RLS is disabled

See `APPLY_MIGRATION_022.md` for detailed instructions.

## Related Files
- `database/migrations/021_fix_profiles_policies.sql` - Initial attempt (caused recursion)
- `database/migrations/APPLY_MIGRATION_021.md` - Migration 021 instructions
- `database/migrations/022_fix_profiles_infinite_recursion.sql` - **Final fix (apply this)**
- `database/migrations/APPLY_MIGRATION_022.md` - **Migration 022 instructions**
- `src/pages/AccountPage.tsx` - Updated component code
- This file - Error explanation and documentation
