-- Migration 027: Add size column to order_items table
-- Description: Add size field to track product size in orders
-- Date: 2025-12-05

-- Add size column to order_items table
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS size TEXT;

-- Add index for size column (optional, but useful for filtering)
CREATE INDEX IF NOT EXISTS idx_order_items_size ON public.order_items(size);

-- Add comment
COMMENT ON COLUMN public.order_items.size IS 'Size of the product if applicable (e.g., S, M, L, XL)';
