-- Migration 016: Fix order_items RLS issue

-- Drop all existing policies on order_items
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;

-- Disable RLS completely on order_items
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
