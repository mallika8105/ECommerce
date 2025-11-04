-- Migration 008: Temporarily disable RLS on categories and subcategories
-- This is a temporary fix to allow updates to work
-- TODO: Implement proper RLS policies later

-- Disable RLS on categories
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Disable RLS on subcategories  
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('categories', 'subcategories');
