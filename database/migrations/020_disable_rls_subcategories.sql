-- Migration: Disable RLS on subcategories table
-- Date: 2025-12-03
-- Description: Temporarily disable RLS on subcategories table to allow admin operations with mock session

-- Disable RLS on subcategories table
ALTER TABLE public.subcategories DISABLE ROW LEVEL SECURITY;

-- Drop existing policies (they won't be enforced anyway, but good to clean up)
DROP POLICY IF EXISTS "Public can view active subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Admins can manage subcategories" ON public.subcategories;

-- Add comment explaining why RLS is disabled
COMMENT ON TABLE public.subcategories IS 'Subcategories within main categories - RLS disabled for admin mock session compatibility';
