import { handleSupabaseError, supabase } from '../config/supabase';

// Activity-related queries
const activityQueries = {
  // Get all active activities, ordered by name
  getActivities: async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};

// Phrase-related queries
const phraseQueries = {
  // Get all phrases with optional filters
  getPhrases: async (filters = {}) => {
    try {
      let query = supabase
        .from('phrasecards')
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
      handleSupabaseError(error);
    }
  },

  // Get a single phrase by ID
  getPhraseById: async (cardId) => {
    try {
      const { data, error } = await supabase
        .from('phrasecards')
        .select('*')
        .eq('id', cardId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Get user progress for phrases
  getUserProgress: async (userId, language = 'Romanian') => {
    try {
      const { data, error } = await supabase
        .from('userprogress')
        .select(`
          *,
          phrasecards (*)
        `)
        .eq('user_id', userId)
        .eq('language', language);
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Update user progress for a phrase
  updateUserProgress: async (userId, cardId, progress, language = 'Romanian') => {
    try {
      const { data, error } = await supabase
        .from('userprogress')
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
      handleSupabaseError(error);
    }
  },

  // Get daily challenges for a user
  getDailyChallenges: async (userId, language = 'Romanian') => {
    try {
      const { data, error } = await supabase
        .from('dailychallenges')
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
      handleSupabaseError(error);
    }
  },

  // Get phrase packs for a specific language
  getPhrasePacks: async (language = 'Romanian') => {
    try {
      const { data, error } = await supabase
        .from('phrasepacks')
        .select('*')
        .eq('target_language', language)
        .order('pack_name', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};

export default {
  phraseQueries,
  activityQueries
}; 