-- Migration: Add address fields to profiles table
-- Version: 003
-- Description: Add address, city, state, pincode columns to profiles table
-- Date: 2025-11-04

-- Add address columns to profiles table
DO $$ 
BEGIN
    -- Add address column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'address'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN address TEXT;
        RAISE NOTICE '✓ Added address column to profiles';
    ELSE
        RAISE NOTICE 'ℹ address column already exists in profiles';
    END IF;

    -- Add city column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'city'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN city TEXT;
        RAISE NOTICE '✓ Added city column to profiles';
    ELSE
        RAISE NOTICE 'ℹ city column already exists in profiles';
    END IF;

    -- Add state column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'state'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN state TEXT;
        RAISE NOTICE '✓ Added state column to profiles';
    ELSE
        RAISE NOTICE 'ℹ state column already exists in profiles';
    END IF;

    -- Add pincode column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'pincode'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN pincode TEXT;
        RAISE NOTICE '✓ Added pincode column to profiles';
    ELSE
        RAISE NOTICE 'ℹ pincode column already exists in profiles';
    END IF;
END $$;

-- Verification
DO $$
DECLARE
    has_address BOOLEAN;
    has_city BOOLEAN;
    has_state BOOLEAN;
    has_pincode BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'address'
    ) INTO has_address;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'city'
    ) INTO has_city;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'state'
    ) INTO has_state;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'pincode'
    ) INTO has_pincode;
    
    IF has_address AND has_city AND has_state AND has_pincode THEN
        RAISE NOTICE '═══════════════════════════════════════';
        RAISE NOTICE '✓✓✓ SUCCESS! ✓✓✓';
        RAISE NOTICE 'All address columns added to profiles table';
        RAISE NOTICE '  - address: %', has_address;
        RAISE NOTICE '  - city: %', has_city;
        RAISE NOTICE '  - state: %', has_state;
        RAISE NOTICE '  - pincode: %', has_pincode;
        RAISE NOTICE '═══════════════════════════════════════';
    ELSE
        RAISE WARNING '⚠ Some columns may be missing';
        IF NOT has_address THEN RAISE WARNING '  - address column missing'; END IF;
        IF NOT has_city THEN RAISE WARNING '  - city column missing'; END IF;
        IF NOT has_state THEN RAISE WARNING '  - state column missing'; END IF;
        IF NOT has_pincode THEN RAISE WARNING '  - pincode column missing'; END IF;
    END IF;
END $$;
