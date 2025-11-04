-- Migration 010: Add missing columns to profiles table

-- Add full_name column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Add phone column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add address column if it doesn't exist (for JSON address data)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Verify columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('full_name', 'phone', 'address');
