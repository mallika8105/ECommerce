-- Migration: Disable RLS on All Tables
-- Purpose: Fix CORS errors caused by RLS blocking requests
-- Run this in Supabase SQL Editor if your project is active but still getting CORS errors

-- Disable RLS on all tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean up
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated insert" ON products;
DROP POLICY IF EXISTS "Allow authenticated update" ON products;
DROP POLICY IF EXISTS "Allow authenticated delete" ON products;

DROP POLICY IF EXISTS "Allow public read access" ON categories;
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON categories;

DROP POLICY IF EXISTS "Allow public read access" ON subcategories;
DROP POLICY IF EXISTS "Allow authenticated users to manage subcategories" ON subcategories;

-- Note: For production use, you should re-enable RLS and create proper policies
-- This is for development/testing only
