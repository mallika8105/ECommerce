-- Migration 006: Ensure display_order columns exist and are initialized
-- Description: Add or verify display_order columns for categories and subcategories
-- Date: 2025-11-04

-- Add display_order to categories if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'display_order'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add display_order to subcategories if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'subcategories' 
        AND column_name = 'display_order'
    ) THEN
        ALTER TABLE public.subcategories ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- Initialize display_order for existing categories (if they're all 0 or NULL)
UPDATE public.categories
SET display_order = subquery.row_num
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY name) as row_num
    FROM public.categories
) AS subquery
WHERE categories.id = subquery.id
AND (categories.display_order IS NULL OR categories.display_order = 0);

-- Initialize display_order for existing subcategories within each category
UPDATE public.subcategories
SET display_order = subquery.row_num
FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY name) as row_num
    FROM public.subcategories
) AS subquery
WHERE subcategories.id = subquery.id
AND (subcategories.display_order IS NULL OR subcategories.display_order = 0);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_subcategories_display_order ON public.subcategories(category_id, display_order);

-- Verify
SELECT 'Categories with display_order:', COUNT(*) 
FROM public.categories 
WHERE display_order IS NOT NULL;

SELECT 'Subcategories with display_order:', COUNT(*) 
FROM public.subcategories 
WHERE display_order IS NOT NULL;
