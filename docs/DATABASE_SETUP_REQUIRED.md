# Database Setup Required - 500 Internal Server Error

## ✅ Good News!

Your Supabase project is now **ACTIVE** - the CORS error is gone!

## ⚠️ New Issue: 500 Internal Server Error

The error you're seeing now:
```
GET .../rest/v1/products?select=*,categories(name)&order=name.asc 
net::ERR_FAILED 500 (Internal Server Error)
```

This means your database tables either:
1. **Don't exist** (database not set up)
2. **Have missing relationships** (foreign keys not configured)
3. **Have incorrect structure**

## Quick Fix - Set Up Your Database

### Option 1: Run the Core Migration (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/jifjjzaofphtebzdwicy
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `database/migrations/001_create_core_tables.sql`
5. Click **Run**

This will create all necessary tables:
- products
- categories  
- subcategories
- orders
- order_items
- profiles

### Option 2: Check if Tables Exist

Run this query in SQL Editor to check:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected output:** You should see tables like:
- categories
- products
- subcategories
- orders
- order_items
- profiles

**If you see NO tables or missing tables:** You need to run migration 001.

### Option 3: Simple Connection Test

Try this simple query first:

```sql
SELECT 1;
```

If this works, your connection is fine and you just need to set up tables.

## Step-by-Step Database Setup

### Step 1: Create Core Tables

Open `database/migrations/001_create_core_tables.sql` and run it in SQL Editor.

### Step 2: Disable RLS (For Development)

Run migration 026 to disable RLS:

```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

### Step 3: Add Sample Data (Optional)

If you want test data, run `database/sample_data.sql`

### Step 4: Restart Your Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 5: Test Again

Try adding a product in the admin panel.

## What If Migration 001 Fails?

If you get errors running migration 001, it might mean:

1. **Tables already exist:** Drop them first
   ```sql
   DROP TABLE IF EXISTS order_items CASCADE;
   DROP TABLE IF EXISTS orders CASCADE;
   DROP TABLE IF EXISTS products CASCADE;
   DROP TABLE IF EXISTS subcategories CASCADE;
   DROP TABLE IF EXISTS categories CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   ```

2. **Then run migration 001 again**

## Verify the Fix

After running migrations:

1. Go to **Table Editor** in Supabase
2. You should see all tables listed
3. Click on `products` - you should see the table structure
4. Click on `categories` - you should see the table structure

## Understanding the Error

The query is trying to:
```sql
SELECT *, categories(name) FROM products
```

This requires:
1. ✅ `products` table to exist
2. ✅ `categories` table to exist  
3. ✅ Foreign key relationship: `products.category_id` → `categories.id`

If any of these are missing, you get a 500 error.

## Quick Diagnostic

Run this in SQL Editor:

```sql
-- Check if products table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'products'
);

-- Check if categories table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'categories'
);
```

Expected: Both should return `true`

## Summary

1. ✅ Your Supabase project IS active (CORS fixed!)
2. ❌ Your database tables are missing or incomplete
3. 🔧 Run migration 001 to create tables
4. 🔧 Run migration 026 to disable RLS
5. ✅ Test again

**Your code is correct - you just need to set up the database!**
