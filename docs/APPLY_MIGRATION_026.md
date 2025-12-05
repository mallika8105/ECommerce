# Apply Migration 026: Disable All RLS

## ⚠️ CRITICAL: Read This First

This migration should ONLY be applied if:

1. ✅ Your Supabase project is **ACTIVE** (not paused)
2. ✅ You're still getting CORS errors after unpausing
3. ✅ You've verified the error is RLS-related

**Do NOT apply this if your project is paused - unpause it first!**

## What This Migration Does

This migration disables Row Level Security (RLS) on all tables to fix CORS errors during development.

**Tables affected:**
- products
- categories
- subcategories
- orders
- order_items
- profiles

## How to Apply

### Step 1: Verify Your Supabase Project is Active

1. Go to: https://supabase.com/dashboard/project/jifjjzaofphtebzdwicy
2. Check if the project shows "Active" status
3. If it says "Paused", click "Restore project" and wait 2-3 minutes

### Step 2: Open SQL Editor

1. In your Supabase Dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**

### Step 3: Copy and Run the Migration

Copy the entire contents of `database/migrations/026_disable_all_rls.sql` and paste it into the SQL Editor, then click **Run**.

```sql
-- Disable RLS on all tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean up
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated insert" ON products;
DROP POLICY IF EXISTS "Allow authenticated update" ON products;
DROP POLICY IF EXISTS "Allow authenticated delete" ON products;

DROP POLICY IF EXISTS "Allow public read access" ON categories;
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON categories;

DROP POLICY IF EXISTS "Allow public read access" ON subcategories;
DROP POLICY IF EXISTS "Allow authenticated users to manage subcategories" ON subcategories;
```

### Step 4: Verify Success

You should see a success message like:
```
Success. No rows returned
```

### Step 5: Restart Your Development Server

```bash
# Stop your current dev server (Ctrl+C)
npm run dev
```

### Step 6: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Step 7: Test the Fix

1. Navigate to Product Management
2. Try to add a product
3. The CORS error should be gone!

## What If It Still Doesn't Work?

If you're still getting CORS errors after applying this migration:

### 1. Check Project Status Again
- Your project might have paused again
- Visit the dashboard and verify it's active

### 2. Check Console for Different Errors
- Open browser DevTools (F12)
- Look at the Console tab
- The error might have changed - share the new error

### 3. Verify Environment Variables
Make sure your `.env` file matches your Supabase project:
```env
VITE_SUPABASE_URL=https://jifjjzaofphtebzdwicy.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### 4. Test Direct API Access
```bash
curl -I https://jifjjzaofphtebzdwicy.supabase.co/rest/v1/products
```

If this fails, your project is paused or inaccessible.

## Important Notes

⚠️ **Security Warning:**
- This migration disables ALL security on your tables
- Your data is now publicly accessible
- **ONLY use this for development/testing**
- Before deploying to production, you MUST re-enable RLS and create proper policies

✅ **For Production:**
- Re-enable RLS on all tables
- Create proper policies for each table
- Test thoroughly with authenticated users

## Rollback (Re-enable RLS)

If you need to re-enable RLS later, run:

```sql
-- Re-enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Then create proper policies for your use case
```

## Migration Applied Successfully?

✅ **Success indicators:**
- No CORS errors in browser console
- Products load successfully
- You can add/edit/delete products
- All CRUD operations work

❌ **Still failing:**
- Review FIX_CORS_ERROR_NOW.md for other solutions
- Your Supabase project might be paused
- There might be network issues
