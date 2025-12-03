/* Migration 019: Add subtotal column to order_items table
   Description: Add missing subtotal column that is required by CheckoutPage
   Date: 2025-12-03 */

-- Add subtotal column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'order_items' 
        AND column_name = 'subtotal'
    ) THEN
        ALTER TABLE public.order_items 
        ADD COLUMN subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Add comment
COMMENT ON COLUMN public.order_items.subtotal IS 'Subtotal for this line item (price * quantity)';

-- Update existing records to calculate subtotal from price and quantity
UPDATE public.order_items 
SET subtotal = price * quantity 
WHERE subtotal = 0 OR subtotal IS NULL;
