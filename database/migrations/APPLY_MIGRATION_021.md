# Apply Migration 021: Fix Profiles Table RLS Policies

## Problem
Users are experiencing 406 and 409 errors when accessing the Account page:
- **406 Error**: Content negotiation failure when querying profiles
- **409 Error**: Conflict when attempting to create/upsert profiles

## Root Cause
The profiles table is missing proper INSERT policies, preventing users from creating their own profile entries when they first access the Account page.

## Solution
Migration 021 fixes the RLS (Row Level Security) policies on the profiles table to:
1. Allow users to SELECT their own profile
2. Allow users to INSERT their own profile (critical for new users)
3. Allow users to UPDATE their own profile
4. Allow admins to view and manage all profiles

## How to Apply

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**

### Step 2: Execute Migration
Copy and paste the entire contents of `021_fix_profiles_policies.sql` and click **Run**

### Step 3: Verify Success
The query should:
- Drop existing policies
- Recreate comprehensive policies
- Show a result table with all the new policies

Expected policies:
- Users can view own profile
- Users can insert own profile
- Users can update own profile
- Admins can view all profiles
- Admins can manage all profiles

### Step 4: Test
1. Log out and log in as a regular user
2. Navigate to the Account page
3. The profile should load without 406/409 errors
4. Update your profile information
5. Verify the changes are saved successfully

## Impact
- ✅ Fixes 406 and 409 errors on Account page
- ✅ Allows new users to create profiles automatically
- ✅ Maintains security with proper RLS policies
- ✅ Preserves admin access to all profiles

## Rollback
If needed, you can temporarily disable RLS:
```sql
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

However, this is NOT recommended for production. Instead, review and fix the policies.
