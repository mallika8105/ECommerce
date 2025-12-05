# 🔧 Fix Subcategory Authentication Error - Step by Step

## ⚠️ Current Issue
You're seeing this error: **"You must be logged in to perform this action"** when trying to manage categories/subcategories in the admin dashboard.

## ✅ Solution
Apply the database migration to disable RLS on the subcategories table.

---

## 📋 Steps to Fix (5 Minutes)

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Log in with your credentials
3. Select your project: **jifjjzaofphtebzdwicy**

### Step 2: Navigate to SQL Editor
1. In the left sidebar, click **"SQL Editor"** (looks like a database icon)
2. Click **"New Query"** button in the top right

### Step 3: Copy and Run the Migration

Copy this entire SQL script and paste it into the SQL editor:

```sql
ALTER TABLE public.subcategories DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active subcategories" ON public.subcategories;

DROP POLICY IF EXISTS "Admins can manage subcategories" ON public.subcategories;

COMMENT ON TABLE public.subcategories IS 'Subcategories within main categories - RLS disabled for admin mock session compatibility';
```

**Important:** Copy ONLY the SQL commands above (without any dashes or comments at the beginning of lines).

### Step 4: Execute the Query
1. Click the **"RUN"** button (or press `Ctrl + Enter`)
2. Wait for the success message: **"Success. No rows returned"**

### Step 5: Verify the Fix
1. Go back to your application at: **http://localhost:5173**
2. Refresh the page (`Ctrl + R` or `F5`)
3. Go to **Categories** page
4. Click on any category to manage subcategories
5. Try to **"Add New Sub-Category"**
6. ✅ It should now work without the authentication error!

---

## 🎯 What This Does

This migration:
- **Disables Row Level Security (RLS)** on the `subcategories` table
- **Removes authentication requirements** for INSERT/UPDATE/DELETE operations
- **Allows your mock admin session** to manage subcategories without needing a real Supabase authenticated user

This follows the same pattern already used for:
- `categories` table (migration 008)
- `products` table (migration 005)
- `profiles` table (migration 012)
- `orders` table (migration 015)
- `order_items` table (migration 014)

---

## 🆘 Troubleshooting

### If the SQL fails:
- Make sure you're logged into the correct Supabase project
- Check that you have admin permissions
- Verify the `subcategories` table exists

### If the error persists after running the migration:
- Clear your browser cache and cookies
- Log out and log back in to the admin dashboard
- Hard refresh the page (`Ctrl + Shift + R`)

### Still having issues?
- Check the browser console for error messages (Press `F12`)
- Verify the migration was applied: Go to **Table Editor → subcategories** and confirm "RLS: Disabled"

---

## 📌 Important Notes

- This is already configured for development with mock authentication
- In production, you would implement proper Supabase authentication and re-enable RLS with appropriate policies
- This migration is safe to apply and won't affect existing data

---

## ✨ After Applying the Fix

You'll be able to:
- ✅ Add new subcategories
- ✅ Edit existing subcategories
- ✅ Delete subcategories
- ✅ Reorder subcategories
- ✅ All admin operations will work smoothly

No code changes needed - just apply the migration!
