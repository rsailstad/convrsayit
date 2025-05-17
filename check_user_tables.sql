-- First check what tables exist and their exact names
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check for auth.users (Supabase often stores users in the auth schema)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth';

-- Try querying from auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email LIKE '%@%';

-- If the above doesn't work, try the default Supabase user table
SELECT id, email, created_at 
FROM auth_users 
WHERE email LIKE '%@%';

-- Then check the users table structure to see the column names
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users';

-- If the table name is 'Users' (capitalized) try this instead
SELECT id, email, created_at 
FROM "Users" 
WHERE email LIKE '%@%'; 