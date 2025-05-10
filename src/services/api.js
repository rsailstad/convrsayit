// src/services/api.js
import Constants from 'expo-constants';
import db from './database';

const supabaseUrl = Constants.expoConfig.extra.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig.extra.supabaseAnonKey;

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

// Fetch phrases for specific activities
export const fetchPhrases = async (activityIds, language = 'Romanian') => {
  try {
    // First get the activities to get their categories
    const activitiesResponse = await fetch(`${supabaseUrl}/rest/v1/activities?select=category&id=in.(${activityIds.join(',')})`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    const activities = await handleResponse(activitiesResponse);
    const categories = activities.map(a => a.category);

    // Then fetch phrases for those categories (removed target_language filter)
    const response = await fetch(`${supabaseUrl}/rest/v1/phrasecards?select=*&category=in.(${categories.map(c => `"${c}"`).join(',')})`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching phrases:', error);
    throw error;
  }
};

// Fetch user progress (e.g., reviewed, used, favorites)
export const fetchUserProgress = async (userId, language = 'Romanian') => {
  try {
    return await db.phraseQueries.getUserProgress(userId, language);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

// Fetch daily challenges for a user
export const fetchDailyChallenges = async (userId, language = 'Romanian') => {
  try {
    return await db.phraseQueries.getDailyChallenges(userId, language);
  } catch (error) {
    console.error('Error fetching daily challenges:', error);
    throw error;
  }
};

// Update user progress for a phrase
export const updateUserProgress = async (userId, cardId, progress, language = 'Romanian') => {
  try {
    return await db.phraseQueries.updateUserProgress(userId, cardId, progress, language);
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

// Fetch activities from the database using REST API
export const fetchActivities = async (language = 'Romanian') => {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/activities?select=*&is_active=eq.true&order=name.asc`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};

// Fetch phrase packs for a specific language
export const fetchPhrasePacks = async (language = 'Romanian') => {
  try {
    return await db.phraseQueries.getPhrasePacks(language);
  } catch (error) {
    console.error('Error fetching phrase packs:', error);
    throw error;
  }
};

// Update user's learning language
export const updateUserLanguage = async (userId, language) => {
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
    throw error;
  }
};

// Add a new activity to the database using REST API
export const addTestActivity = async () => {
  const testActivity = {
    name: '🦜 This is a test activity from Supabase',
    category: 'Test',
    is_active: true
  };
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/activities`, {
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
};

// Add sample phrases for common activities
export const addSamplePhrases = async () => {
  const samplePhrases = [
    // Shopping phrases
    {
      english_phrase: 'Where is the nearest store?',
      translated_phrase: 'Unde este cel mai apropiat magazin?',
      category: 'Shopping',
      difficulty_level: 'Beginner',
      target_language: 'Romanian',
      grammar_breakdown: '"Unde" means "where", "este" means "is", "cel mai apropiat" means "the nearest", "magazin" means "store".',
      joke_slang_alternative: 'Unde-i magazinu\'? (Casual/slang version)',
      phonetic_breakdown: '[OON-deh YES-teh chel my ah-pro-pee-AHT mah-gah-ZEEN]'
    },
    {
      english_phrase: 'How much does this product cost?',
      translated_phrase: 'Cât costă acest produs?',
      category: 'Shopping',
      difficulty_level: 'Beginner',
      target_language: 'Romanian',
      grammar_breakdown: '"Cât" means "how much", "costă" means "costs", "acest" means "this", "produs" means "product".',
      joke_slang_alternative: 'Cât e? (Very casual version)',
      phonetic_breakdown: '[Kut KOSS-tuh ah-CHYEST PROH-doos]'
    },
    {
      english_phrase: 'Do you have this size?',
      translated_phrase: 'Aveți această mărime?',
      category: 'Shopping',
      difficulty_level: 'Intermediate',
      target_language: 'Romanian',
      grammar_breakdown: '"Aveți" is the formal "you have", "această" means "this", "mărime" means "size".',
      joke_slang_alternative: 'Ai mărimea asta? (Informal version)',
      phonetic_breakdown: '[ah-VETS ah-CHYAS-tuh mah-REE-meh]'
    },
    {
      english_phrase: 'Can you show me other colors?',
      translated_phrase: 'Puteți să îmi arătați alte culori?',
      category: 'Shopping',
      difficulty_level: 'Intermediate',
      target_language: 'Romanian',
      grammar_breakdown: '"Puteți" is the formal "can you", "să îmi arătați" means "to show me", "alte" means "other", "culori" means "colors".',
      joke_slang_alternative: 'Mai ai și alte culori? (Casual version)',
      phonetic_breakdown: '[POO-tets suh im ah-ruh-TATS AHL-teh koo-LOR-ee]'
    },
    {
      english_phrase: 'I want to return this product.',
      translated_phrase: 'Vreau să returnez acest produs.',
      category: 'Shopping',
      difficulty_level: 'Intermediate',
      target_language: 'Romanian',
      grammar_breakdown: '"Vreau" means "I want", "să returnez" means "to return", "acest" means "this", "produs" means "product".',
      joke_slang_alternative: 'Vreau să-l dau înapoi. (Casual version)',
      phonetic_breakdown: '[VROW suh reh-toor-NEZ ah-CHYEST PROH-doos]'
    }
  ];

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/phrasecards`, {
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
}; 