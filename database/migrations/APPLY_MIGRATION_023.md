# Apply Migration 023: Remove Email Unique Constraint

## Problem
Users are unable to update their profiles due to a duplicate email constraint error:

```
PATCH .../profiles?id=eq.... 409 (Conflict)
Error: duplicate key value violates unique constraint "profiles_email_key"
Key (email)=(mallikam8105@gmail.com) already exists.
```

## Root Cause
The `profiles` table has a unique constraint on the `email` column. This causes issues when:
1. Multiple user accounts exist with the same email address
2. Users try to update their profile information
3. The database tries to update/insert with an email that already exists

Since Supabase Auth allows the same email to be reused (after deletion/recreation), the profiles table should also allow this.

## Solution
Migration 023 removes the unique constraint on the `email` column in the `profiles` table. This allows:
- Multiple profiles to have the same email (matching auth.users behavior)
- Users to update their profiles without email conflicts
- The `id` column remains the unique identifier (primary key)

## How to Apply

### Step 1: Access Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project: **jifjjzaofphtebzdwicy**
3. Click **SQL Editor** in the left sidebar

### Step 2: Execute Migration
1. Click **New Query**
2. Copy and paste the SQL below:

```sql
-- Migration 023: Remove unique constraint on profiles email column

-- Drop the unique constraint on email
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_email_key;

-- Verify the constraint is removed
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
    AND conname = 'profiles_email_key';
```

3. Click **Run** or press `Ctrl+Enter`

### Step 3: Verify Success
The verification query should return **no rows**, confirming the constraint has been removed.

If the constraint still existed before, you would have seen:
```
constraint_name     | constraint_type
--------------------|----------------
profiles_email_key  | u
```

After successful migration, the query returns **empty** (no rows).

### Step 4: Test Your Application
1. **Hard refresh** your browser (Ctrl+Shift+R)
2. **Go to Account page** (`/account`)
3. **Update your profile information**
4. **Click "Update Profile"**

You should now see:
- ✅ "Profile updated successfully!" message
- ✅ No 409 Conflict errors
- ✅ No duplicate email errors
- ✅ Changes saved correctly

## Impact

**What This Fixes:**
- ✅ 409 Conflict error when updating profiles
- ✅ Duplicate email constraint violations
- ✅ Users can now update all profile fields
- ✅ Profile system works reliably

**Security Considerations:**
- ✅ Each profile still has a unique `id` (primary key)
- ✅ Profile data is tied to authenticated users
- ✅ Application code ensures users only modify their own data
- ✅ Matches the behavior of Supabase Auth's user management

**Note:** This change only affects the `profiles` table. The `auth.users` table (managed by Supabase) has its own email uniqueness rules which remain unchanged.

## Rollback (if needed)

If you need to restore the unique constraint (not recommended):

```sql
-- WARNING: This will fail if duplicate emails exist in the table
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_email_key UNIQUE (email);
```

However, you would first need to resolve any duplicate emails in the database before this would work.

## Related Migrations
- Migration 022: Fixed infinite recursion in RLS policies
- Migration 021: Attempted to fix RLS policies (caused recursion)
- This migration (023): Removes email unique constraint

## Summary
After applying this migration, the profile update functionality will work correctly without email constraint conflicts.
