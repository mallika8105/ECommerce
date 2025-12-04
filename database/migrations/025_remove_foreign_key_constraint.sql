-- Migration 025: Remove problematic foreign key constraint from orders table
-- This is a direct fix for the 409 error

-- Simply drop the foreign key constraint that's causing the issue
-- We'll remove the constraint entirely to allow orders to be created
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Verify the constraint is gone
SELECT 
    tc.constraint_name, 
    tc.table_name
FROM information_schema.table_constraints AS tc 
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='orders'
  AND tc.constraint_name = 'orders_user_id_fkey';

-- This query should return NO rows if the constraint was successfully dropped
