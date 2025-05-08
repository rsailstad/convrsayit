import * as Speech from 'expo-speech';

// Speak a given text using Expo's Speech module
export const speak = async (text, language = 'ro-RO') => {
  try {
    await Speech.speak(text, {
      language,
      pitch: 1.0,
      rate: 0.9,
    });
  } catch (error) {
    console.error('Error during TTS:', error);
    throw error;
  }
};

// Stop any ongoing speech
export const stopSpeaking = async () => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Error stopping TTS:', error);
    throw error;
  }
}; 