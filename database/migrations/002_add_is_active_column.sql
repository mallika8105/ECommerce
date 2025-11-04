-- Migration: Add is_active column to existing tables
-- Version: 002
-- Description: Add is_active column to categories, subcategories, and products
-- Date: 2025-11-04
-- Use Case: For existing databases that don't have is_active column

-- =============================================
-- ADD is_active TO CATEGORIES
-- =============================================
DO $$ 
BEGIN
    -- Check if column exists before adding
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE public.categories 
        ADD COLUMN is_active BOOLEAN DEFAULT true;
        
        -- Update all existing rows to be active
        UPDATE public.categories SET is_active = true;
        
        -- Create index
        CREATE INDEX IF NOT EXISTS idx_categories_active_order 
        ON public.categories(is_active, display_order);
        
        RAISE NOTICE 'Added is_active column to categories table';
    ELSE
        RAISE NOTICE 'is_active column already exists in categories table';
    END IF;
END $$;

-- =============================================
-- ADD is_active TO SUBCATEGORIES
-- =============================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'subcategories' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE public.subcategories 
        ADD COLUMN is_active BOOLEAN DEFAULT true;
        
        UPDATE public.subcategories SET is_active = true;
        
        CREATE INDEX IF NOT EXISTS idx_subcategories_active_order 
        ON public.subcategories(is_active, display_order);
        
        RAISE NOTICE 'Added is_active column to subcategories table';
    ELSE
        RAISE NOTICE 'is_active column already exists in subcategories table';
    END IF;
END $$;

-- =============================================
-- ADD is_active TO PRODUCTS
-- =============================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN is_active BOOLEAN DEFAULT true;
        
        UPDATE public.products SET is_active = true;
        
        CREATE INDEX IF NOT EXISTS idx_products_active 
        ON public.products(is_active);
        
        RAISE NOTICE 'Added is_active column to products table';
    ELSE
        RAISE NOTICE 'is_active column already exists in products table';
    END IF;
END $$;

-- =============================================
-- ADD OTHER OPTIONAL COLUMNS TO PRODUCTS
-- =============================================
DO $$ 
BEGIN
    -- Add is_featured column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'is_featured'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN is_featured BOOLEAN DEFAULT false;
        
        CREATE INDEX IF NOT EXISTS idx_products_featured 
        ON public.products(is_featured) WHERE is_featured = true;
        
        RAISE NOTICE 'Added is_featured column to products table';
    END IF;

    -- Add is_bestseller column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'is_bestseller'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN is_bestseller BOOLEAN DEFAULT false;
        
        CREATE INDEX IF NOT EXISTS idx_products_bestseller 
        ON public.products(is_bestseller) WHERE is_bestseller = true;
        
        RAISE NOTICE 'Added is_bestseller column to products table';
    END IF;

    -- Add discount_percentage column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'discount_percentage'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN discount_percentage DECIMAL(5, 2) DEFAULT 0 
        CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
        
        RAISE NOTICE 'Added discount_percentage column to products table';
    END IF;

    -- Add subcategory_id column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'subcategory_id'
    ) THEN
        ALTER TABLE public.products 
        ADD COLUMN subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;
        
        CREATE INDEX IF NOT EXISTS idx_products_subcategory 
        ON public.products(subcategory_id);
        
        RAISE NOTICE 'Added subcategory_id column to products table';
    END IF;
END $$;

-- =============================================
-- UPDATE RLS POLICIES
-- =============================================

-- Drop and recreate policies for categories
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Drop and recreate policies for subcategories
DROP POLICY IF EXISTS "Public can view active subcategories" ON public.subcategories;
CREATE POLICY "Public can view active subcategories" ON public.subcategories
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage subcategories" ON public.subcategories;
CREATE POLICY "Admins can manage subcategories" ON public.subcategories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Drop and recreate policies for products
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =============================================
-- VERIFICATION
-- =============================================

-- Verify columns were added
DO $$
DECLARE
    categories_has_is_active BOOLEAN;
    subcategories_has_is_active BOOLEAN;
    products_has_is_active BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' AND column_name = 'is_active'
    ) INTO categories_has_is_active;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subcategories' AND column_name = 'is_active'
    ) INTO subcategories_has_is_active;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'is_active'
    ) INTO products_has_is_active;
    
    IF categories_has_is_active AND subcategories_has_is_active AND products_has_is_active THEN
        RAISE NOTICE '✓ SUCCESS: All tables now have is_active column';
    ELSE
        RAISE WARNING '⚠ WARNING: Some tables may be missing is_active column';
    END IF;
END $$;
