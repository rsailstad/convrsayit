/**
 * Data transformation utilities
 * Contains functions for converting data from API/DB format to UI format
 */

/**
 * Transforms API phrase data to UI component format
 * @param {Object} phrase - Raw phrase data from API
 * @returns {Object} - Transformed phrase data for UI components
 */
export const transformPhraseForUI = (phrase) => {
  return {
    id: phrase.card_id || phrase.id,
    english_phrase: phrase.english_phrase || phrase.native_phrase,
    translated_phrase: phrase.translated_phrase,
    category: phrase.category || phrase.activity,
    level: phrase.difficulty_level || 'Standard',
    grammar: phrase.grammar_breakdown || phrase.grammar_tip || 'No grammar notes available.',
    joke: phrase.joke_slang_alternative || phrase.slang_version || 'No alternative version available.',
    phonetic: phrase.phonetic_breakdown || phrase.phonetic || 'No phonetic guide available.'
  };
};

/**
 * Transforms API phrase data array to UI component format
 * @param {Array} phrases - Raw phrase data array from API
 * @returns {Array} - Array of transformed phrase data for UI components
 */
export const transformPhrasesForUI = (phrases) => {
  if (!Array.isArray(phrases)) {
    return [];
  }
  return phrases.map(transformPhraseForUI);
};

/**
 * Transforms AI-generated phrase data to UI component format
 * @param {Object} phrase - AI-generated phrase data
 * @param {number} index - Index for generating unique ID
 * @returns {Object} - Transformed phrase data for UI components
 */
export const transformAIPhraseForUI = (phrase, index) => {
  return {
    id: `ai-${index}`,
    english_phrase: phrase.native_phrase,
    translated_phrase: phrase.translated_phrase,
    category: phrase.activity,
    level: 'AI Generated',
    grammar: phrase.grammar_tip || 'No grammar notes available.',
    joke: phrase.slang_version || 'No alternative version available.',
    phonetic: phrase.phonetic || 'No phonetic guide available.'
  };
};

/**
 * Transforms AI-generated phrase data array to UI component format
 * @param {Array} phrases - Raw AI-generated phrase data array
 * @returns {Array} - Array of transformed phrase data for UI components
 */
export const transformAIPhrasesForUI = (phrases) => {
  if (!Array.isArray(phrases)) {
    return [];
  }
  return phrases.map((phrase, index) => transformAIPhraseForUI(phrase, index));
}; 