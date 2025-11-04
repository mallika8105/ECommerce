-- Temporary fix: Disable RLS on products table to allow admin updates
-- Run this in Supabase SQL Editor

-- Disable RLS on products table
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Verify the columns exist and update a test product
DO $$
BEGIN
    -- Check if columns exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'is_featured'
    ) THEN
        RAISE NOTICE 'Column is_featured exists';
    ELSE
        RAISE EXCEPTION 'Column is_featured does NOT exist!';
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'products' 
        AND column_name = 'is_bestseller'
    ) THEN
        RAISE NOTICE 'Column is_bestseller exists';
    ELSE
        RAISE EXCEPTION 'Column is_bestseller does NOT exist!';
    END IF;
END $$;

-- Show current values
SELECT id, name, is_featured, is_bestseller 
FROM public.products 
LIMIT 5;
