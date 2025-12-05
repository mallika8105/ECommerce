-- Migration: Add requires_size_chart field to products table
-- Description: Add a boolean field to control whether a product needs a size chart display
-- Date: 2025-12-05

-- Add requires_size_chart column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS requires_size_chart BOOLEAN DEFAULT false;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_requires_size_chart 
ON public.products(requires_size_chart) 
WHERE requires_size_chart = true;

-- Add comment for documentation
COMMENT ON COLUMN public.products.requires_size_chart IS 
'Indicates whether this product requires a size chart (e.g., clothing items need size charts, but perfumes do not)';

-- Update existing clothing products to require size chart by default
-- This is a safe default for products in clothing categories
UPDATE public.products
SET requires_size_chart = true
WHERE category_id IN (
  SELECT id FROM public.categories 
  WHERE LOWER(name) LIKE '%men''s%' 
     OR LOWER(name) LIKE '%women''s%' 
     OR LOWER(name) LIKE '%kid''s%'
     OR LOWER(name) LIKE '%children%'
     OR LOWER(name) LIKE '%clothing%'
     OR LOWER(name) LIKE '%apparel%'
);

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Migration 028: Successfully added requires_size_chart field to products table';
END $$;
