// src/services/ai.js
import * as SecureStore from 'expo-secure-store';
import { IS_DEVELOPMENT, OPENAI_API_KEY, OPENAI_API_URL } from '../config/env';
import { DEFAULT_NATIVE_LANGUAGE, DEFAULT_TARGET_LANGUAGE, STORAGE_KEYS } from '../constants/app';

// API configuration
const BASE_URL = OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
const API_KEY_STORAGE_KEY = STORAGE_KEYS.OPENAI_API_KEY;

/**
 * Gets the OpenAI API key from the appropriate source
 * - In development: Uses the environment variable or a fallback
 * - In production: Retrieves from secure storage
 */
async function getApiKey() {
  try {
    // For development, use environment variable if available
    if (IS_DEVELOPMENT && OPENAI_API_KEY) {
      return OPENAI_API_KEY;
    }
    
    // For production or if env var not available, retrieve from secure storage
    const storedKey = await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
    if (storedKey) {
      return storedKey;
    }
    
    // Fallback for development only
    if (IS_DEVELOPMENT) {
      console.warn("Using fallback API key for development. Set up proper environment variables for production.");
      return "YOUR_OPENAI_API_KEY"; // Replace with your own key for development
    }
    
    throw new Error("API key not found. Please set it in secure storage or environment variables.");
  } catch (error) {
    console.error("Error retrieving API key:", error);
    throw new Error("Failed to get API key. Please check your configuration.");
  }
}

/**
 * Saves the API key to secure storage
 * Use this when the user enters their API key in your app
 */
export async function saveApiKey(apiKey) {
  try {
    await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, apiKey);
    return true;
  } catch (error) {
    console.error("Error saving API key:", error);
    return false;
  }
}

/**
 * Generates language phrasecards based on specified activities
 * 
 * @param {Object} params - Parameters for generating phrasecards
 * @param {string[]} params.activities - Array of activity descriptions
 * @param {string} params.targetLanguage - Language the user wants to learn
 * @param {string} params.nativeLanguage - User's native language
 * @returns {Promise<Array>} - Array of phrasecard objects
 */
export async function generatePhrasecards({ 
  activities, 
  targetLanguage = DEFAULT_TARGET_LANGUAGE, 
  nativeLanguage = DEFAULT_NATIVE_LANGUAGE 
}) {
  try {
    // Validate inputs
    if (!Array.isArray(activities) || activities.length < 1) {
      throw new Error('Activities must be an array with at least one item');
    }
    
    if (!targetLanguage || !nativeLanguage) {
      throw new Error('Both targetLanguage and nativeLanguage must be provided');
    }

    // Get API key securely
    const apiKey = await getApiKey();

    // Build the system prompt
    // This is the most critical part - it instructs GPT how to format the response
    const systemPrompt = `
      You are a language learning assistant specializing in ${targetLanguage}.
      
      Your task is to create conversational phrasecards for ${nativeLanguage} speakers learning ${targetLanguage}.
      
      For each activity in the provided list, generate a useful conversational phrase that would be commonly used in that situation.
      
      For EACH activity, return a JSON object with these exact fields:
      - activity: The name of the activity
      - native_phrase: A natural, conversational phrase in ${nativeLanguage}
      - translated_phrase: The same phrase accurately translated to ${targetLanguage}
      - phonetic: A phonetic pronunciation guide for non-native speakers
      - grammar_tip: A brief explanation of an interesting grammar point in this phrase
      - slang_version: An alternative, more casual or slang version that a native would use
      
      Format your ENTIRE response as a valid JSON array of these objects, with no additional text or explanation.
    `;

    // Create messages array for API call
    const messages = [
      { 
        role: "system", 
        content: systemPrompt 
      },
      { 
        role: "user", 
        content: `Generate phrasecards for the following activities: ${activities.join(", ")}` 
      }
    ];

    // Make API call to OpenAI
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // You can also use "gpt-4" or other models
        messages: messages,
        temperature: 0.7, // Adjust for creativity vs consistency
        max_tokens: 2000, // Adjust based on expected response length
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the response content
    try {
      // Extract the content from the first choice
      const content = data.choices[0].message.content;
      
      // Parse the JSON string into an object
      const phrasecards = JSON.parse(content);
      
      // Validate that we got an array of objects with the expected properties
      if (!Array.isArray(phrasecards)) {
        throw new Error('Response is not an array');
      }
      
      // Check that each object has the required fields
      const requiredFields = ['activity', 'native_phrase', 'translated_phrase', 'phonetic', 'grammar_tip', 'slang_version'];
      
      phrasecards.forEach((card, index) => {
        requiredFields.forEach(field => {
          if (!(field in card)) {
            throw new Error(`Missing field '${field}' in item ${index}`);
          }
        });
      });
      
      return phrasecards;
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Error generating phrasecards:", error);
    throw error; // Re-throw to allow the caller to handle the error
  }
}

// Helper function to handle OpenAI API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'OpenAI API request failed');
  }
  return response.json();
};

// Explain a phrase using OpenAI
export const explainPhrase = async (phrase, targetLanguage = 'English', context = null) => {
  try {
    // Get API key securely
    const apiKey = await getApiKey();
    
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Explain the Romanian phrase "${phrase}" in plain ${targetLanguage}. ${context ? context : ''} Also, provide up to 3 casual alternatives for this phrase if appropriate. Structure your response as a JSON object with two keys: "explanation" (string) and "alternatives" (array of strings).`,
          },
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error explaining phrase:', error);
    throw error;
  }
};

// Generate alternative versions of a phrase
export const generateAlternatives = async (phrase, style, language = 'Romanian', count = 3) => {
  try {
    // Get API key securely
    const apiKey = await getApiKey();
    
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Given the ${language} phrase: "${phrase}" Generate ${count} alternative versions of this phrase in a "${style}" style. Return the alternatives as a JSON object with a single key "alternatives" which is an array of strings.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error generating alternatives:', error);
    throw error;
  }
};

// Clarify grammar using OpenAI
export const clarifyGrammar = async (question, phraseContext = null, language = 'Romanian') => {
  try {
    // Get API key securely
    const apiKey = await getApiKey();
    
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Regarding ${language} grammar: ${phraseContext ? `The question is about the phrase: "${phraseContext}".` : ''} Question: "${question}" Provide a clear and concise answer in plain English. Return the answer as a JSON object with a single key "answer" which is a string.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error clarifying grammar:', error);
    throw error;
  }
};

export default {
  generatePhrasecards,
  saveApiKey,
  explainPhrase,
  generateAlternatives,
  clarifyGrammar
}; 