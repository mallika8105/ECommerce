-- Migration: Add is_active column to existing tables (FIXED VERSION)
-- Version: 002
-- Description: Add is_active column to categories, subcategories, and products
-- Date: 2025-11-04
-- IMPORTANT: This version fixes the order of operations to avoid errors

-- =============================================
-- STEP 1: DISABLE RLS TEMPORARILY
-- =============================================
ALTER TABLE IF EXISTS public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 2: DROP ALL EXISTING RLS POLICIES
-- =============================================
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Public can view active subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Admins can manage subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- =============================================
-- STEP 3: ADD COLUMNS
-- =============================================

-- Add is_active to categories
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN is_active BOOLEAN DEFAULT true;
        UPDATE public.categories SET is_active = true WHERE is_active IS NULL;
        RAISE NOTICE '✓ Added is_active to categories';
    ELSE
        RAISE NOTICE 'ℹ is_active already exists in categories';
    END IF;
END $$;

-- Add display_order to categories if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'display_order'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN display_order INTEGER DEFAULT 0;
        RAISE NOTICE '✓ Added display_order to categories';
    END IF;
END $$;

-- Add is_active to subcategories
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'subcategories' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE public.subcategories ADD COLUMN is_active BOOLEAN DEFAULT true;
        UPDATE public.subcategories SET is_active = true WHERE is_active IS NULL;
        RAISE NOTICE '✓ Added is_active to subcategories';
    ELSE
        RAISE NOTICE 'ℹ is_active already exists in subcategories';
    END IF;
END $$;

-- Add display_order to subcategories if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'subcategories' 
        AND column_name = 'display_order'
    ) THEN
        ALTER TABLE public.subcategories ADD COLUMN display_order INTEGER DEFAULT 0;
        RAISE NOTICE '✓ Added display_order to subcategories';
    END IF;
END $$;

-- Add is_active to products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_active BOOLEAN DEFAULT true;
        UPDATE public.products SET is_active = true WHERE is_active IS NULL;
        RAISE NOTICE '✓ Added is_active to products';
    ELSE
        RAISE NOTICE 'ℹ is_active already exists in products';
    END IF;
END $$;

-- Add is_featured to products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'is_featured'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN DEFAULT false;
        RAISE NOTICE '✓ Added is_featured to products';
    END IF;
END $$;

-- Add is_bestseller to products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'is_bestseller'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_bestseller BOOLEAN DEFAULT false;
        RAISE NOTICE '✓ Added is_bestseller to products';
    END IF;
END $$;

-- Add discount_percentage to products
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'discount_percentage'
    ) THEN
        ALTER TABLE public.products ADD COLUMN discount_percentage DECIMAL(5, 2) DEFAULT 0;
        ALTER TABLE public.products ADD CONSTRAINT check_discount_percentage 
            CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
        RAISE NOTICE '✓ Added discount_percentage to products';
    END IF;
END $$;

-- Add subcategory_id to products if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'subcategory_id'
    ) THEN
        ALTER TABLE public.products ADD COLUMN subcategory_id UUID;
        -- Only add foreign key if subcategories table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subcategories') THEN
            ALTER TABLE public.products 
                ADD CONSTRAINT fk_products_subcategory 
                FOREIGN KEY (subcategory_id) 
                REFERENCES public.subcategories(id) ON DELETE SET NULL;
        END IF;
        RAISE NOTICE '✓ Added subcategory_id to products';
    END IF;
END $$;

-- =============================================
-- STEP 4: CREATE INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_categories_active_order 
    ON public.categories(is_active, display_order);

CREATE INDEX IF NOT EXISTS idx_subcategories_active_order 
    ON public.subcategories(is_active, display_order);

CREATE INDEX IF NOT EXISTS idx_products_active 
    ON public.products(is_active);

CREATE INDEX IF NOT EXISTS idx_products_featured 
    ON public.products(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_products_bestseller 
    ON public.products(is_bestseller) WHERE is_bestseller = true;

CREATE INDEX IF NOT EXISTS idx_products_subcategory 
    ON public.products(subcategory_id);

-- =============================================
-- STEP 5: RE-ENABLE RLS
-- =============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 6: CREATE NEW RLS POLICIES (NOW SAFE)
-- =============================================

-- Categories policies
CREATE POLICY "Public can view active categories" ON public.categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Subcategories policies
CREATE POLICY "Public can view active subcategories" ON public.subcategories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage subcategories" ON public.subcategories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Products policies
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_active = true);

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
DO $$
DECLARE
    cat_has_active BOOLEAN;
    sub_has_active BOOLEAN;
    prod_has_active BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' AND column_name = 'is_active'
    ) INTO cat_has_active;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subcategories' AND column_name = 'is_active'
    ) INTO sub_has_active;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'is_active'
    ) INTO prod_has_active;
    
    IF cat_has_active AND sub_has_active AND prod_has_active THEN
        RAISE NOTICE '═══════════════════════════════════════';
        RAISE NOTICE '✓✓✓ SUCCESS! ✓✓✓';
        RAISE NOTICE 'All tables now have is_active column';
        RAISE NOTICE 'RLS policies updated successfully';
        RAISE NOTICE '═══════════════════════════════════════';
    ELSE
        RAISE WARNING '⚠ Some columns may be missing';
        IF NOT cat_has_active THEN
            RAISE WARNING '  - categories.is_active missing';
        END IF;
        IF NOT sub_has_active THEN
            RAISE WARNING '  - subcategories.is_active missing';
        END IF;
        IF NOT prod_has_active THEN
            RAISE WARNING '  - products.is_active missing';
        END IF;
    END IF;
END $$;
