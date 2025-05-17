import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { supabase } from '../config/supabase';

// Constants
const SESSION_KEY = 'session';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Helper function to handle Supabase errors
const handleAuthError = (error) => {
  console.error('Auth error:', error.message);
  throw error;
};

export const authService = {
  // Sign up with email/password
  signUp: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: Platform.select({
            ios: 'convrsayit://auth/callback',
            android: 'convrsayit://auth/callback',
            default: 'https://convrsayit.com/auth/callback'
          })
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // Sign in with email/password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      
      // Store session securely
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(data.session));
      return data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // Sign in with magic link
  signInWithMagicLink: async (email) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: Platform.select({
            ios: 'convrsayit://auth/callback',
            android: 'convrsayit://auth/callback',
            default: 'https://convrsayit.com/auth/callback'
          })
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: Platform.select({
          ios: 'convrsayit://auth/reset-password',
          android: 'convrsayit://auth/reset-password',
          default: 'https://convrsayit.com/auth/reset-password'
        })
      });
      if (error) throw error;
      return data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return data;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear stored session
      await SecureStore.deleteItemAsync(SESSION_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      handleAuthError(error);
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const sessionStr = await SecureStore.getItemAsync(SESSION_KEY);
      if (!sessionStr) return null;
      return JSON.parse(sessionStr);
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      handleAuthError(error);
    }
  },

  // Refresh session
  refreshSession: async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      // Update stored session
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(data.session));
      return data;
    } catch (error) {
      handleAuthError(error);
    }
  }
}; 