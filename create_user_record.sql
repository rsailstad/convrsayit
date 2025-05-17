-- Insert your auth user into the public users table
-- Replace the values below with your actual user ID and email
INSERT INTO users (
  id, 
  email, 
  native_language, 
  learning_level
) VALUES (
  'YOUR_AUTH_USER_ID',   -- Replace with your actual auth user ID
  'your_email@example.com',  -- Replace with your actual email
  'English',              -- Your native language
  'Intermediate'          -- Your learning level
)
ON CONFLICT (id) DO NOTHING;

-- Verify the insertion worked
SELECT * FROM users WHERE id = 'YOUR_AUTH_USER_ID'; 