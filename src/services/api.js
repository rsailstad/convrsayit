// src/services/api.js
import Constants from 'expo-constants';

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

// Fetch phrases (e.g., for a specific category or pack)
export const fetchPhrases = async (params = {}) => {
  try {
    return await phraseQueries.getPhrases(params);
  } catch (error) {
    console.error('Error fetching phrases:', error);
    throw error;
  }
};

// Fetch user progress (e.g., reviewed, used, favorites)
export const fetchUserProgress = async (userId) => {
  try {
    return await phraseQueries.getUserProgress(userId);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

// Fetch daily challenges for a user
export const fetchDailyChallenges = async (userId) => {
  try {
    return await phraseQueries.getDailyChallenges(userId);
  } catch (error) {
    console.error('Error fetching daily challenges:', error);
    throw error;
  }
};

// Update user progress for a phrase
export const updateUserProgress = async (userId, cardId, progress) => {
  try {
    return await phraseQueries.updateUserProgress(userId, cardId, progress);
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

// Fetch activities from the database using REST API
export const fetchActivities = async () => {
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