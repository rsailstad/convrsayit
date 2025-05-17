import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import ErrorBoundary from '../../components/ErrorBoundary';
import ErrorMessage from '../../components/ErrorMessage';
import PhraseCardComponent from '../../components/PhraseCard';
import { DEFAULT_NATIVE_LANGUAGE, DEFAULT_TARGET_LANGUAGE, GENERATION_MODES } from '../../constants/app';
import { fetchPhrases } from '../../services/apiService';
import { colors, spacing, typography } from '../../theme';
import { generatePhrasecards } from '../../utils/ai';
import { transformAIPhrasesForUI, transformPhrasesForUI } from '../../utils/transformers';

const PhraseCardContent = () => {
  const route = useRoute();
  const { activity, activities, mode = GENERATION_MODES.STATIC } = route.params;
  const [phrases, setPhrases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPhrases = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Determine which mode to use for phrasecard generation
      if (mode === GENERATION_MODES.STATIC) {
        // Use existing API-based logic
        const activityIds = activity ? [activity.id] : activities.map(a => a.id);
        const fetchedPhrases = await fetchPhrases(activityIds);
        
        // Transform the data to match the PhraseCard component's expected format
        setPhrases(transformPhrasesForUI(fetchedPhrases));
        
      } else if (mode === GENERATION_MODES.DYNAMIC) {
        // Use AI-generated phrasecards
        try {
          // Extract activity names for the AI prompt
          const activityNames = activity 
            ? [activity.name] 
            : activities.map(a => a.name);
            
          // Call the AI generation function
          const generatedPhrases = await generatePhrasecards({
            activities: activityNames,
            nativeLanguage: DEFAULT_NATIVE_LANGUAGE,
            targetLanguage: DEFAULT_TARGET_LANGUAGE
          });
          
          // Transform the AI response to match the PhraseCard component's expected format
          setPhrases(transformAIPhrasesForUI(generatedPhrases));
          
        } catch (aiError) {
          console.error('Error generating phrases with AI:', aiError);
          
          // Fallback to static mode if AI fails
          console.log('Falling back to static phrase generation...');
          const activityIds = activity ? [activity.id] : activities.map(a => a.id);
          const fetchedPhrases = await fetchPhrases(activityIds);
          
          setPhrases(transformPhrasesForUI(fetchedPhrases));
          
          // Set a user-friendly error message but don't block the UI
          setError('AI generation failed. Showing pre-made phrases instead.');
        }
      } else {
        throw new Error(`Unsupported phrase generation mode: ${mode}`);
      }
    } catch (err) {
      console.error('Error loading phrases:', err);
      setError('Failed to load phrases. Please try again.');
      // Clear phrases to show the error state
      setPhrases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhrases();
  }, [activity, activities, mode]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (phrases.length === 0) {
    return (
      <View style={styles.container}>
        {error ? (
          <ErrorMessage 
            error={error}
            onRetry={loadPhrases}
          />
        ) : (
          <Text style={styles.noPhrasesText}>
            No phrases found for {activity ? activity.name : 'selected activities'}.
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <ErrorMessage 
          error={error} 
          type="warning"
          style={styles.errorBanner}
        />
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

const PhraseCardScreen = () => {
  return (
    <ErrorBoundary>
      <PhraseCardContent />
    </ErrorBoundary>
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