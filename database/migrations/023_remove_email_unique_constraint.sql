-- Migration 023: Remove unique constraint on profiles email column
-- This allows multiple users to have the same email in profiles table
-- (matching the auth.users behavior where emails can be reused)

-- Drop the unique constraint on email
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_email_key;

-- Verify the constraint is removed
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
    AND conname = 'profiles_email_key';

-- Note: After this migration, emails in profiles table are no longer unique
-- The primary key (id) remains unique and is the main identifier
