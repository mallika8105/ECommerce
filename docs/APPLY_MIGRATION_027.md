# Apply Migration 027: Add Size Column to Order Items

## Overview
This migration adds a `size` column to the `order_items` table to track product sizes in orders.

## What This Migration Does
- Adds a `size` TEXT column to the `order_items` table
- Creates an index on the `size` column for better query performance
- Adds appropriate column comments

## How to Apply

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `027_add_size_to_order_items.sql`
5. Click **Run** or press `Ctrl/Cmd + Enter`
6. Verify the migration was successful (you should see "Success. No rows returned")

### Option 2: Using Supabase CLI

```bash
# Make sure you're in the project root directory
supabase db push

# Or apply the specific migration file
psql $DATABASE_URL -f database/migrations/027_add_size_to_order_items.sql
```

## Verification

After applying the migration, verify it was successful:

```sql
-- Check if the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'order_items' 
AND column_name = 'size';

-- Check if the index was created
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'order_items' 
AND indexname = 'idx_order_items_size';
```

You should see:
- The `size` column with data type `text`
- The `idx_order_items_size` index

## Rollback (If Needed)

If you need to rollback this migration:

```sql
-- Remove the index
DROP INDEX IF EXISTS public.idx_order_items_size;

-- Remove the column
ALTER TABLE public.order_items
DROP COLUMN IF EXISTS size;
```

## Impact
- **Breaking Changes**: None - this is a non-breaking additive change
- **Data Loss**: None - existing data is preserved
- **Performance**: Minimal - adds a single nullable column and index

## Next Steps
After applying this migration:
1. The size selected by users will now be stored in orders
2. The size will be visible in the checkout page and order history
3. No code changes needed - the application is already updated to use this field
