-- Insert a test premium subscription for the user
-- User ID: e7280afe-e726-4205b481-b9ad23efffd6

-- Let's create a row in the public.users table if needed (to satisfy the foreign key)
-- First, get your auth.users ID from Auth
-- (Run this first to find your auth user ID)
SELECT id, email FROM auth.users WHERE email LIKE '%@%';

-- Once you have your auth user ID, insert a record in the public users table
-- Replace 'YOUR_AUTH_USER_ID' with your actual auth user ID from the query above
INSERT INTO users (
  id, 
  email, 
  native_language, 
  learning_level
) VALUES (
  'YOUR_AUTH_USER_ID', -- Replace with your auth user ID
  'your_email@example.com', -- Replace with your email
  'English',
  'Intermediate'
)
ON CONFLICT (id) DO NOTHING;

-- Insert a premium subscription for your user
-- Replace 'YOUR_AUTH_USER_ID' with your actual auth user ID

INSERT INTO user_subscriptions (
    user_id,
    tier,
    valid_until,
    active
) VALUES (
    'YOUR_AUTH_USER_ID',  -- Replace with your auth user ID
    'premium',           -- Use 'basic' or 'premium'
    CURRENT_TIMESTAMP + INTERVAL '1 month',  -- Valid for 1 month from now
    true
)
ON CONFLICT (user_id) 
DO UPDATE SET
    tier = EXCLUDED.tier,
    valid_until = EXCLUDED.valid_until,
    active = EXCLUDED.active,
    updated_at = CURRENT_TIMESTAMP;

-- Verify the inserted/updated record
SELECT * FROM user_subscriptions 
WHERE user_id = 'YOUR_AUTH_USER_ID'; 