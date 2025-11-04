-- Migration 011: Add payment_status column to orders table

-- Add payment_status column if it doesn't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Verify column
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name = 'payment_status';
