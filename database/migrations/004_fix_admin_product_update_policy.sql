-- Migration 004: Fix Admin Product Update Policy
-- Description: Ensure admins can update all product fields including is_featured and is_bestseller
-- Date: 2025-11-04

-- Drop existing admin policy if it exists
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Create separate policies for better control
-- Allow admins to SELECT all products
CREATE POLICY "Admins can view all products" ON public.products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to INSERT products
CREATE POLICY "Admins can insert products" ON public.products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to UPDATE products with WITH CHECK clause
CREATE POLICY "Admins can update products" ON public.products
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Allow admins to DELETE products
CREATE POLICY "Admins can delete products" ON public.products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Verify the columns exist (they should from migration 001)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'is_featured'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN DEFAULT false;
        CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'is_bestseller'
    ) THEN
        ALTER TABLE public.products ADD COLUMN is_bestseller BOOLEAN DEFAULT false;
        CREATE INDEX idx_products_bestseller ON public.products(is_bestseller) WHERE is_bestseller = true;
    END IF;
END $$;
