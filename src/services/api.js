// src/services/api.js
const { phraseQueries, activityQueries } = require('./database');

// Placeholder for API base URL, e.g., from environment variables
const API_BASE_URL = 'https://api.example.com';

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

// Fetch activities from the database
export const fetchActivities = async () => {
  try {
    return await activityQueries.getActivities();
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
}; 