# How to Apply Migration 016

This migration fixes the Row-Level Security (RLS) issue on the `order_items` table that was causing the 403 Forbidden error.

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard at https://supabase.com/dashboard
2. Navigate to **SQL Editor** from the left sidebar
3. Click **New Query**
4. Copy the entire contents of `database/migrations/016_fix_order_items_rls.sql`
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter`
7. Verify the output shows `rowsecurity = false` for the order_items table

## Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Make sure you're logged in
supabase login

# Link to your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push
```

## Option 3: Using psql (Direct Database Connection)

If you have PostgreSQL client tools installed:

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f database/migrations/016_fix_order_items_rls.sql
```

## Verification

After applying the migration, verify it worked by running this separate query in a new SQL Editor query:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'order_items';
```

Expected result: `rowsecurity = false` (or `rowsecurity = f`)

## What This Migration Does

- Drops all existing RLS policies on the `order_items` table
- Disables Row-Level Security completely on `order_items`
- This allows authenticated users to insert order items without RLS blocking them

## After Migration

Once the migration is applied, the checkout process should work without the 403 Forbidden error.
