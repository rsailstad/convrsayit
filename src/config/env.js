/**
 * Environment configuration
 * Centralizes environment-specific settings
 */

import Constants from 'expo-constants';

// Determine the current environment
const ENV = process.env.NODE_ENV || 'development';
export const IS_DEVELOPMENT = ENV === 'development';
export const IS_PRODUCTION = ENV === 'production';

// API URLs
export const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
export const SUPABASE_URL = Constants.manifest?.extra?.supabaseUrl || process.env.SUPABASE_URL;
export const SUPABASE_ANON_KEY = Constants.manifest?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY;

// API Keys (only for development, in production these should be stored securely)
export const OPENAI_API_KEY = IS_DEVELOPMENT ? process.env.OPENAI_API_KEY : null;

// App Configuration
export const DEFAULT_LANGUAGE = 'en';
export const APP_VERSION = Constants.manifest?.version || '1.0.0';

// Feature flags
export const FEATURES = {
  OFFLINE_MODE: true,
  PUSH_NOTIFICATIONS: IS_PRODUCTION,
  DEBUG_LOGGING: IS_DEVELOPMENT,
};

// Export all environment variables in a single object
export default {
  ENV,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  OPENAI_API_URL,
  OPENAI_API_KEY,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  DEFAULT_LANGUAGE,
  APP_VERSION,
  FEATURES,
}; 