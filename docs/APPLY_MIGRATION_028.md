# Apply Migration 028: Add requires_size_chart Field

## Purpose
This migration adds a `requires_size_chart` field to the products table to control which products display a size chart button. This allows products like perfumes, accessories, or cosmetics to not show size charts even if they're in clothing categories.

## Steps to Apply

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste Migration**
   - Open `database/migrations/028_add_requires_size_chart.sql`
   - Copy the entire content
   - Paste into the SQL Editor

4. **Execute Migration**
   - Click "Run" button
   - Wait for confirmation message

5. **Verify**
   - Go to "Table Editor" → "products"
   - Check that `requires_size_chart` column exists
   - Verify that clothing products have `requires_size_chart = true`

## What This Migration Does

- Adds `requires_size_chart` boolean column (default: false)
- Creates an index for better query performance
- Automatically sets `requires_size_chart = true` for existing clothing products
- Products in categories containing: men's, women's, kid's, children, clothing, or apparel will have this field set to true

## After Migration

- Update products that shouldn't have size charts (like perfumes, accessories) by setting `requires_size_chart = false`
- The ProductDetails page will only show the size chart button for products where `requires_size_chart = true`
- Admins can control this field when adding/editing products

## Rollback (if needed)

```sql
-- Remove the column
ALTER TABLE public.products DROP COLUMN IF EXISTS requires_size_chart;

-- Remove the index
DROP INDEX IF EXISTS idx_products_requires_size_chart;
