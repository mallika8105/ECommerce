# Apply Migration 020: Disable RLS on Subcategories Table

## Issue
When trying to add or manage subcategories in the admin dashboard with a mock admin session, the following error occurs:
```
You must be logged in to perform this action.
```

## Root Cause
The mock admin session is stored in React state and localStorage but is NOT registered with Supabase's authentication system. When Row Level Security (RLS) policies check `auth.uid()`, it returns null because there's no authenticated Supabase user, causing the RLS policy to block INSERT/UPDATE/DELETE operations on the subcategories table.

## Solution
Disable RLS on the subcategories table, similar to how it was disabled for other tables (categories, products, profiles, orders, order_items) to allow admin operations with the mock session.

## Steps to Apply Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `database/migrations/020_disable_rls_subcategories.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

```bash
# Make sure you're in the project root directory
cd c:/Users/91810/OneDrive/Desktop/Projects/Ecommerce

# Run the migration
supabase db execute --file database/migrations/020_disable_rls_subcategories.sql
```

## Migration Script
```sql
-- Migration: Disable RLS on subcategories table
-- Date: 2025-12-03
-- Description: Temporarily disable RLS on subcategories table to allow admin operations with mock session

-- Disable RLS on subcategories table
ALTER TABLE public.subcategories DISABLE ROW LEVEL SECURITY;

-- Drop existing policies (they won't be enforced anyway, but good to clean up)
DROP POLICY IF EXISTS "Public can view active subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Admins can manage subcategories" ON public.subcategories;

-- Add comment explaining why RLS is disabled
COMMENT ON TABLE public.subcategories IS 'Subcategories within main categories - RLS disabled for admin mock session compatibility';
```

## Verification

After applying the migration, verify it worked:

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **subcategories**
3. Check that RLS is disabled (should show "RLS: Disabled")

Then test in your application:
1. Log in to the admin dashboard using mock credentials (admin@example.com / Admin@123)
2. Navigate to Categories → Select a category → Manage Subcategories
3. Try to add a new subcategory
4. The operation should now succeed without the "You must be logged in" error

## Notes
- This migration follows the same pattern as migrations 005, 008, 012, 014, and 015 which disabled RLS on other tables
- RLS is disabled to support the mock admin authentication system
- In a production environment with proper authentication, you should re-enable RLS and implement proper policies
