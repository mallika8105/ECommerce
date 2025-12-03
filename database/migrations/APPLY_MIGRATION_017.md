# Apply Migration 017: Ensure Order Items Columns

## Problem
The `order_items` table is missing the `product_code` column that the application code expects. This causes a "PGRST204" error when placing orders:

```
Could not find the 'product_code' column of 'order_items' in the schema cache
```

## Solution
Migration 017 adds the missing columns to the `order_items` table:
- `product_code` (TEXT, NOT NULL, default 'N/A')
- `product_image_url` (TEXT, nullable) - if not already present

## How to Apply

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `database/migrations/017_ensure_order_items_columns.sql`
5. Click **Run** to execute the migration
6. Verify the migration was successful (no errors shown)

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Navigate to your project directory
cd path/to/your/project

# Apply the migration
supabase db push --file database/migrations/017_ensure_order_items_columns.sql
```

## Verification

After applying the migration, verify the columns exist:

1. In Supabase Dashboard, go to **Table Editor**
2. Select the `order_items` table
3. Verify these columns exist:
   - `id`
   - `order_id`
   - `product_id`
   - `product_name`
   - `product_code` ← **Should be present now**
   - `product_image_url` ← **Should be present now**
   - `quantity`
   - `price`
   - `subtotal`
   - `created_at`

## Test the Fix

1. Navigate to your e-commerce application
2. Add items to cart
3. Go to checkout page
4. Fill in shipping details
5. Click "Place Order"
6. The order should be created successfully without the "product_code" error

## Rollback (if needed)

If you need to rollback this migration:

```sql
-- Remove the columns (only if needed)
ALTER TABLE public.order_items DROP COLUMN IF EXISTS product_code;
ALTER TABLE public.order_items DROP COLUMN IF EXISTS product_image_url;
```

**Note:** Only rollback if absolutely necessary, as this will break the current checkout functionality.
