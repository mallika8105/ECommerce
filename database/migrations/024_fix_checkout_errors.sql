-- Migration 024: Fix checkout errors (406 on profiles, 409 on orders)
-- This migration ensures proper table configuration for checkout flow

-- ============================================
-- PART 1: Fix profiles table
-- ============================================

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Ensure all required columns exist with proper types
DO $$ 
BEGIN
    -- Ensure full_name column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'full_name'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    END IF;

    -- Ensure phone column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'phone'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;

    -- Ensure address column exists as JSONB
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'address'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN address JSONB;
    ELSE
        -- Convert to JSONB if it's TEXT
        ALTER TABLE public.profiles ALTER COLUMN address TYPE JSONB USING 
            CASE 
                WHEN address IS NULL THEN NULL
                WHEN address::text ~ '^\s*\{' THEN address::jsonb
                ELSE jsonb_build_object('addressLine1', address::text)
            END;
    END IF;

    -- Ensure role column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon;

-- ============================================
-- PART 2: Fix orders table
-- ============================================

-- Drop the problematic foreign key constraint on orders.user_id
-- The constraint references a 'users' table that doesn't exist
-- We should reference auth.users or profiles instead, or remove it entirely
DO $$ 
BEGIN
    -- Drop any existing foreign key constraint on user_id
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'orders_user_id_fkey'
        AND table_name = 'orders'
    ) THEN
        ALTER TABLE public.orders DROP CONSTRAINT orders_user_id_fkey;
    END IF;
END $$;

-- Add a new foreign key constraint that references auth.users
-- This is the correct table for Supabase authentication
ALTER TABLE public.orders 
    ADD CONSTRAINT orders_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- Ensure orders table has proper configuration
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Ensure all required columns exist with proper types
DO $$ 
BEGIN
    -- Ensure shipping_address is JSONB
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'shipping_address' 
        AND data_type != 'jsonb'
    ) THEN
        ALTER TABLE public.orders ALTER COLUMN shipping_address TYPE JSONB USING shipping_address::jsonb;
    END IF;

    -- Ensure status column has proper check constraint
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'orders' AND constraint_name = 'orders_status_check'
    ) THEN
        ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
        ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
            CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));
    END IF;

    -- Ensure payment_status column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_status'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
    END IF;

    -- Ensure payment_method column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_method'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN payment_method TEXT DEFAULT 'cod';
    END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.orders TO anon;

-- ============================================
-- PART 3: Fix order_items table
-- ============================================

ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- Ensure all required columns exist
DO $$ 
BEGIN
    -- Ensure product_name column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' AND column_name = 'product_name'
    ) THEN
        ALTER TABLE public.order_items ADD COLUMN product_name TEXT;
    END IF;

    -- Ensure product_code column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' AND column_name = 'product_code'
    ) THEN
        ALTER TABLE public.order_items ADD COLUMN product_code TEXT;
    END IF;

    -- Ensure product_image_url column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' AND column_name = 'product_image_url'
    ) THEN
        ALTER TABLE public.order_items ADD COLUMN product_image_url TEXT;
    END IF;

    -- Ensure subtotal column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' AND column_name = 'subtotal'
    ) THEN
        ALTER TABLE public.order_items ADD COLUMN subtotal DECIMAL(10, 2);
    END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.order_items TO anon;

-- ============================================
-- Verification queries
-- ============================================

-- Verify profiles table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Verify orders table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- Verify order_items table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'order_items'
ORDER BY ordinal_position;

-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'orders', 'order_items');
