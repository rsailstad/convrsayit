const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize the Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
const handleSupabaseError = (error) => {
  console.error('Supabase error:', error.message);
  throw error;
};

module.exports = {
  supabase,
  handleSupabaseError
}; 