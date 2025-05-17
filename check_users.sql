-- Check users in the auth schema
SELECT id, email, created_at 
FROM auth.users 
WHERE email LIKE '%@%';

-- Check users in the public schema
SELECT id, email, created_at, native_language, learning_level
FROM users 
WHERE email LIKE '%@%'; 