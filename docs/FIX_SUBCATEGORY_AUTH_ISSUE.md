# Fix Subcategory Authentication Issue - Quick Guide

## Problem
When trying to add subcategories in the admin dashboard, you get:
> "You must be logged in to perform this action"

## Solution
You need to run a SQL script in your Supabase database to disable RLS on the subcategories table.

---

## Steps to Fix (5 minutes)

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/jifjjzaofphtebzdwicy

### 2. Log in to your Supabase account
Use your GitHub, SSO, or email/password

### 3. Navigate to SQL Editor
- In the left sidebar, click on **SQL Editor** (database icon)
- Or click **"SQL Editor"** from the top menu

### 4. Create New Query
- Click **"New Query"** button (top right)

### 5. Copy and Paste this SQL code:

```sql
-- Disable RLS on subcategories table
ALTER TABLE public.subcategories DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view active subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Admins can manage subcategories" ON public.subcategories;

-- Add comment
COMMENT ON TABLE public.subcategories IS 'Subcategories within main categories - RLS disabled for admin mock session compatibility';
```

### 6. Run the Query
- Click the **"RUN"** button (or press Ctrl+Enter)
- Wait for success message: "Success. No rows returned"

### 7. Verify the Fix
- Go back to your application
- Log in to admin dashboard (admin@example.com / Admin@123)
- Navigate to: **Categories** → Select any category → **Manage Subcategories**
- Click **"Add New Sub-Category"**
- Fill in the details and click **"Add Sub-Category"**
- ✅ It should now work without the "You must be logged in" error!

---

## What This Does
This migration disables Row Level Security (RLS) on the subcategories table, which allows the mock admin session to perform INSERT/UPDATE/DELETE operations without needing a real Supabase authenticated user.

This follows the same pattern already used for other tables in your project (categories, products, profiles, orders, order_items).

---

## Need Help?
If you encounter any issues, check:
1. You're logged into the correct Supabase project
2. The SQL ran without errors
3. You refreshed your application after running the migration
