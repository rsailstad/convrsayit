/**
 * AI utilities for generating phrasecards and translations
 */

import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// API configuration
const BASE_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY_STORAGE_KEY = "openai_api_key";

/**
 * Gets the OpenAI API key from the appropriate source
 * - In development: Uses the environment variable or a fallback
 * - In production: Retrieves from secure storage
 */
async function getApiKey() {
  try {
    // For development, you can use environment variables with Expo
    if (__DEV__) {
      // Use the key from environment variables if available
      const envKey = Constants.expoConfig?.extra?.openaiApiKey;
      if (envKey) {
        return envKey;
      }
      
      // Fallback for development only
      console.warn("Using fallback API key for development. Set up proper environment variables for production.");
      return "YOUR_OPENAI_API_KEY"; // Replace with your own key for development
    }
    
    // For production, retrieve from secure storage
    const storedKey = await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
    if (!storedKey) {
      throw new Error("API key not found in secure storage");
    }
    
    return storedKey;
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
async function generatePhrasecards({ activities, targetLanguage, nativeLanguage }) {
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
    // The content should be a JSON string containing our array of phrasecard objects
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

/**
 * Example usage:
 * 
 * const activities = [
 *   "Ordering coffee",
 *   "Asking for directions",
 *   "Paying a delivery driver",
 *   "Introducing yourself",
 *   "Asking for the check at a restaurant"
 * ];
 * 
 * const phrasecards = await generatePhrasecards({
 *   activities,
 *   targetLanguage: "Romanian",
 *   nativeLanguage: "English"
 * });
 */

// Export generatePhrasecards only here, saveApiKey is already exported with its declaration
export { generatePhrasecards };
