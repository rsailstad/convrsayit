// src/services/ai.js

// Placeholder for OpenAI API key, e.g., from environment variables
const OPENAI_API_KEY = 'your_openai_api_key_here';

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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
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