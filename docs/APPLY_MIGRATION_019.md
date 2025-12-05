# Migration 019: Add subtotal column to order_items

## Problem
The `order_items` table is missing the `subtotal` column, which causes a 400 error when placing orders:
```
Could not find the 'subtotal' column of 'order_items' in the schema cache
```

## Solution
This migration adds the `subtotal` column to the `order_items` table.

## How to Apply

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `019_add_subtotal_to_order_items.sql`
4. Paste and run the SQL

### Option 2: Supabase CLI
```bash
supabase db push
```

### Option 3: Direct psql
```bash
psql -h <your-db-host> -U postgres -d postgres -f database/migrations/019_add_subtotal_to_order_items.sql
```

## What This Migration Does

1. **Adds `subtotal` column** to `order_items` table
   - Type: DECIMAL(10, 2)
   - NOT NULL with default value of 0
   - Only adds if the column doesn't exist

2. **Updates existing records**
   - Calculates subtotal as `price * quantity` for any existing rows

3. **Adds documentation**
   - Adds a comment explaining the column purpose

## Verification

After applying the migration, verify it worked:

```sql
-- Check if subtotal column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'order_items' 
AND column_name = 'subtotal';

-- View the table structure
\d order_items
```

Expected result:
- `subtotal` column should be present with type `numeric(10,2)`

## Testing
After applying the migration, test placing an order through the checkout page. The error should be resolved.
