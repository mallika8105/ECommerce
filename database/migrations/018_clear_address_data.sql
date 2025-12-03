-- Clear all address data from profiles table
-- This removes mock data and allows users to start fresh
-- Run this in your Supabase SQL Editor

UPDATE public.profiles
SET 
  phone = NULL,
  address = NULL,
  full_name = NULL,
  city = NULL,
  state = NULL,
  pincode = NULL;

-- Verification query
SELECT 
  id,
  email,
  phone,
  address,
  full_name,
  city,
  state,
  pincode
FROM public.profiles;
