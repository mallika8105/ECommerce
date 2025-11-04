-- Migration 014: Disable RLS on order_items table

-- Disable RLS on order_items
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'order_items';
