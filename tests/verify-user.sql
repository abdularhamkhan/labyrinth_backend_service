-- Manually verify test user in Supabase
-- Run this in Supabase SQL Editor or via psql

-- Update the user's email confirmation status
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'abdularhamkhanzada@gmail.com';

-- Verify the update
SELECT id, email, email_confirmed_at, confirmed_at 
FROM auth.users 
WHERE email = 'abdularhamkhanzada@gmail.com';
