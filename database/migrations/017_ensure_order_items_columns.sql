/* Migration 017: Ensure order_items table has all required columns
   Description: Add missing columns to order_items table if they don't exist
   Date: 2025-12-03 */

-- Add product_code column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'order_items' 
        AND column_name = 'product_code'
    ) THEN
        ALTER TABLE public.order_items 
        ADD COLUMN product_code TEXT NOT NULL DEFAULT 'N/A';
    END IF;
END $$;

-- Add product_image_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'order_items' 
        AND column_name = 'product_image_url'
    ) THEN
        ALTER TABLE public.order_items 
        ADD COLUMN product_image_url TEXT;
    END IF;
END $$;

-- Ensure RLS is disabled on order_items (as per migration 016)
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- Add comment
COMMENT ON COLUMN public.order_items.product_code IS 'Product code/SKU at time of order';
COMMENT ON COLUMN public.order_items.product_image_url IS 'Product image URL at time of order';
