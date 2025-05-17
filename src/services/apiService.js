/**
 * Unified API Service
 * Provides a consistent interface for all API interactions
 */

import Constants from 'expo-constants';
import { handleSupabaseError, supabase } from '../config/supabase';
import { API_ENDPOINTS, DEFAULT_TARGET_LANGUAGE } from '../constants/app';
import { createCachedFunction, generateCacheKey } from '../utils/cache';

// Extract environment variables
const supabaseUrl = Constants.expoConfig.extra.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig.extra.supabaseAnonKey;

// Cache TTL configurations (in milliseconds)
const CACHE_TTL = {
  ACTIVITIES: 5 * 60 * 1000, // 5 minutes
  PHRASES: 10 * 60 * 1000, // 10 minutes
  USER_PROGRESS: 2 * 60 * 1000, // 2 minutes
  PHRASE_PACKS: 30 * 60 * 1000, // 30 minutes
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

/**
 * Activity-related API services
 */
export const activityService = {
  /**
   * Fetch all activities
   * @param {Object} options - Optional parameters
   * @returns {Promise<Array>} - List of activities
   */
  getActivities: createCachedFunction(
    async (options = {}) => {
      try {
        if (options.useRESTAPI) {
          // REST API approach
          const response = await fetch(
            `${supabaseUrl}/rest/v1/${API_ENDPOINTS.ACTIVITIES}?select=*&is_active=eq.true&order=name.asc`,
            {
              headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
              }
            }
          );
          return await handleResponse(response);
        } else {
          // Supabase client approach
          const { data, error } = await supabase
            .from(API_ENDPOINTS.ACTIVITIES)
            .select('*')
            .eq('is_active', true)
            .order('name', { ascending: true });
          
          if (error) throw error;
          return data;
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        handleSupabaseError(error);
        throw error;
      }
    },
    (options) => generateCacheKey('getActivities', options),
    CACHE_TTL.ACTIVITIES
  ),

  /**
   * Add a test activity
   * @returns {Promise<Object>} - The created activity
   */
  addTestActivity: async () => {
    const testActivity = {
      name: '🦜 This is a test activity from Supabase',
      category: 'Test',
      is_active: true
    };
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${API_ENDPOINTS.ACTIVITIES}`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify([testActivity])
      });
      
      const data = await handleResponse(response);
      console.log('✅ Test activity inserted:', data);
      return data;
    } catch (error) {
      console.error('Error inserting test activity:', error);
      throw error;
    }
  }
};

/**
 * Phrase-related API services
 */
export const phraseService = {
  /**
   * Fetch phrases for specific activities
   * @param {Array} activityIds - List of activity IDs
   * @param {string} language - Target language
   * @returns {Promise<Array>} - List of phrases
   */
  getPhrasesByActivityIds: createCachedFunction(
    async (activityIds, language = DEFAULT_TARGET_LANGUAGE) => {
      try {
        // First get the activities to get their categories
        const activitiesResponse = await fetch(
          `${supabaseUrl}/rest/v1/${API_ENDPOINTS.ACTIVITIES}?select=category&id=in.(${activityIds.join(',')})`,
          {
            headers: {
              'apikey': supabaseAnonKey,
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            }
          }
        );
        
        const activities = await handleResponse(activitiesResponse);
        const categories = activities.map(a => a.category);

        // Then fetch phrases for those categories
        const response = await fetch(
          `${supabaseUrl}/rest/v1/${API_ENDPOINTS.PHRASE_CARDS}?select=*&category=in.(${categories.map(c => `"${c}"`).join(',')})`,
          {
            headers: {
              'apikey': supabaseAnonKey,
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            }
          }
        );
        
        return await handleResponse(response);
      } catch (error) {
        console.error('Error fetching phrases:', error);
        throw error;
      }
    },
    (activityIds, language) => generateCacheKey('getPhrasesByActivityIds', { activityIds, language }),
    CACHE_TTL.PHRASES
  ),

  /**
   * Get all phrases with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} - List of phrases
   */
  getPhrases: createCachedFunction(
    async (filters = {}) => {
      try {
        let query = supabase
          .from(API_ENDPOINTS.PHRASE_CARDS)
          .select('*');

        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.difficulty_level) {
          query = query.eq('difficulty_level', filters.difficulty_level);
        }
        if (filters.pack_id) {
          query = query.eq('pack_id', filters.pack_id);
        }
        if (filters.target_language) {
          query = query.eq('target_language', filters.target_language);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching phrases with filters:', error);
        handleSupabaseError(error);
        throw error;
      }
    },
    (filters) => generateCacheKey('getPhrases', filters),
    CACHE_TTL.PHRASES
  ),

  /**
   * Get phrase packs for a specific language
   * @param {string} language - Target language
   * @returns {Promise<Array>} - List of phrase packs
   */
  getPhrasePacks: createCachedFunction(
    async (language = DEFAULT_TARGET_LANGUAGE) => {
      try {
        const { data, error } = await supabase
          .from(API_ENDPOINTS.PHRASE_PACKS)
          .select('*')
          .eq('target_language', language)
          .order('pack_name', { ascending: true });
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching phrase packs:', error);
        handleSupabaseError(error);
        throw error;
      }
    },
    (language) => generateCacheKey('getPhrasePacks', { language }),
    CACHE_TTL.PHRASE_PACKS
  ),

  /**
   * Add sample phrases for testing
   * @returns {Promise<Array>} - Created phrases
   */
  addSamplePhrases: async () => {
    const samplePhrases = [
      // Shopping phrases
      {
        english_phrase: 'Where is the nearest store?',
        translated_phrase: 'Unde este cel mai apropiat magazin?',
        category: 'Shopping',
        difficulty_level: 'Beginner',
        target_language: DEFAULT_TARGET_LANGUAGE,
        grammar_breakdown: '"Unde" means "where", "este" means "is", "cel mai apropiat" means "the nearest", "magazin" means "store".',
        joke_slang_alternative: 'Unde-i magazinu\'? (Casual/slang version)',
        phonetic_breakdown: '[OON-deh YES-teh chel my ah-pro-pee-AHT mah-gah-ZEEN]'
      },
      // ... more sample phrases could be added here
    ];

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/${API_ENDPOINTS.PHRASE_CARDS}`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(samplePhrases)
      });
      
      const data = await handleResponse(response);
      console.log('✅ Sample phrases inserted:', data);
      return data;
    } catch (error) {
      console.error('Error inserting sample phrases:', error);
      throw error;
    }
  }
};

/**
 * User-related API services
 */
export const userService = {
  /**
   * Fetch user progress
   * @param {string} userId - User ID
   * @param {string} language - Target language
   * @returns {Promise<Array>} - User progress data
   */
  getUserProgress: async (userId, language = DEFAULT_TARGET_LANGUAGE) => {
    try {
      const { data, error } = await supabase
        .from(API_ENDPOINTS.USER_PROGRESS)
        .select(`
          *,
          phrasecards (*)
        `)
        .eq('user_id', userId)
        .eq('language', language);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      handleSupabaseError(error);
      throw error;
    }
  },

  /**
   * Update user progress for a phrase
   * @param {string} userId - User ID
   * @param {string} cardId - Phrase card ID
   * @param {Object} progress - Progress data to update
   * @param {string} language - Target language
   * @returns {Promise<Object>} - Updated progress data
   */
  updateUserProgress: async (userId, cardId, progress, language = DEFAULT_TARGET_LANGUAGE) => {
    try {
      const { data, error } = await supabase
        .from(API_ENDPOINTS.USER_PROGRESS)
        .upsert({
          user_id: userId,
          card_id: cardId,
          language: language,
          ...progress,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user progress:', error);
      handleSupabaseError(error);
      throw error;
    }
  },

  /**
   * Update user's learning language
   * @param {string} userId - User ID
   * @param {string} language - New language
   * @returns {Promise<Object>} - Updated user data
   */
  updateUserLanguage: async (userId, language) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ learning_language: language })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user language:', error);
      handleSupabaseError(error);
      throw error;
    }
  },

  /**
   * Get daily challenges for a user
   * @param {string} userId - User ID
   * @param {string} language - Target language
   * @returns {Promise<Array>} - Daily challenges
   */
  getDailyChallenges: async (userId, language = DEFAULT_TARGET_LANGUAGE) => {
    try {
      const { data, error } = await supabase
        .from(API_ENDPOINTS.DAILY_CHALLENGES)
        .select(`
          *,
          phrasecards (*)
        `)
        .eq('user_id', userId)
        .eq('language', language)
        .eq('assigned_date', new Date().toISOString().split('T')[0]);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching daily challenges:', error);
      handleSupabaseError(error);
      throw error;
    }
  }
};

// Add aliases for backward compatibility
export const fetchPhrases = phraseService.getPhrasesByActivityIds;
export const fetchActivities = activityService.getActivities;
export const fetchUserProgress = userService.getUserProgress;
export const fetchDailyChallenges = userService.getDailyChallenges;
export const updateUserProgress = userService.updateUserProgress;
export const fetchPhrasePacks = phraseService.getPhrasePacks;
export const updateUserLanguage = userService.updateUserLanguage;
export const addTestActivity = activityService.addTestActivity;
export const addSamplePhrases = phraseService.addSamplePhrases; 