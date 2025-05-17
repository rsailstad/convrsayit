import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import PhraseCardComponent from '../../components/PhraseCard';
import { fetchPhrases } from '../../services/api';
import { colors, spacing, typography } from '../../theme';
import { generatePhrasecards } from '../../utils/ai';

const PhraseCardScreen = () => {
  const route = useRoute();
  const { activity, activities, mode = 'static' } = route.params;
  const [phrases, setPhrases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPhrases = async () => {
      try {
        setLoading(true);
        
        // Determine which mode to use for phrasecard generation
        if (mode === 'static') {
          // Use existing API-based logic
          const activityIds = activity ? [activity.id] : activities.map(a => a.id);
          const fetchedPhrases = await fetchPhrases(activityIds);
          
          // Transform the data to match the PhraseCard component's expected format
          const transformedPhrases = fetchedPhrases.map(phrase => ({
            id: phrase.card_id,
            english_phrase: phrase.english_phrase,
            translated_phrase: phrase.translated_phrase,
            category: phrase.category,
            level: phrase.difficulty_level,
            grammar: phrase.grammar_breakdown || 'No grammar notes available.',
            joke: phrase.joke_slang_alternative || 'No alternative version available.',
            phonetic: phrase.phonetic_breakdown || 'No phonetic guide available.'
          }));
          
          setPhrases(transformedPhrases);
        } else if (mode === 'dynamic') {
          // Use AI-generated phrasecards
          try {
            // Extract activity names for the AI prompt
            const activityNames = activity 
              ? [activity.name] 
              : activities.map(a => a.name);
              
            // Call the AI generation function
            const generatedPhrases = await generatePhrasecards({
              activities: activityNames,
              nativeLanguage: 'English',
              targetLanguage: 'Romanian' // TODO: Make this configurable
            });
            
            // Transform the AI response to match the PhraseCard component's expected format
            const transformedPhrases = generatedPhrases.map((phrase, index) => ({
              id: `ai-${index}`,
              english_phrase: phrase.native_phrase,
              translated_phrase: phrase.translated_phrase,
              category: phrase.activity,
              level: 'AI Generated',
              grammar: phrase.grammar_tip || 'No grammar notes available.',
              joke: phrase.slang_version || 'No alternative version available.',
              phonetic: phrase.phonetic || 'No phonetic guide available.'
            }));
            
            setPhrases(transformedPhrases);
          } catch (aiError) {
            console.error('Error generating phrases with AI:', aiError);
            
            // Fallback to static mode if AI fails
            console.log('Falling back to static phrase generation...');
            const activityIds = activity ? [activity.id] : activities.map(a => a.id);
            const fetchedPhrases = await fetchPhrases(activityIds);
            
            const transformedPhrases = fetchedPhrases.map(phrase => ({
              id: phrase.card_id,
              english_phrase: phrase.english_phrase,
              translated_phrase: phrase.translated_phrase,
              category: phrase.category,
              level: phrase.difficulty_level,
              grammar: phrase.grammar_breakdown || 'No grammar notes available.',
              joke: phrase.joke_slang_alternative || 'No alternative version available.',
              phonetic: phrase.phonetic_breakdown || 'No phonetic guide available.'
            }));
            
            setPhrases(transformedPhrases);
            
            // Set a user-friendly error message but don't block the UI
            setError('AI generation failed. Showing pre-made phrases instead.');
          }
        } else {
          throw new Error(`Unsupported phrase generation mode: ${mode}`);
        }
      } catch (err) {
        console.error('Error loading phrases:', err);
        setError('Failed to load phrases. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPhrases();
  }, [activity, activities, mode]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error && phrases.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (phrases.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPhrasesText}>
          No phrases found for {activity ? activity.name : 'selected activities'}.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}
      <PhraseCardComponent
        phraseData={phrases[currentIndex]}
        onNext={() => setCurrentIndex((prev) => (prev + 1) % phrases.length)}
        onPrevious={() => setCurrentIndex((prev) => (prev - 1 + phrases.length) % phrases.length)}
        currentIndex={currentIndex}
        totalPhrases={phrases.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.medium,
    textAlign: 'center',
  },
  noPhrasesText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.medium,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: spacing.sm,
    borderRadius: 4,
    marginBottom: spacing.md,
    width: '100%',
  },
  errorBannerText: {
    color: colors.error,
    fontSize: typography.fontSize.small,
    textAlign: 'center',
  },
});

export default PhraseCardScreen; 