import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import PhraseCardComponent from '../../components/PhraseCard';
import { fetchPhrases } from '../../services/api';
import { colors, spacing, typography } from '../../theme';

const PhraseCardScreen = () => {
  const route = useRoute();
  const { activity, activities } = route.params;
  const [phrases, setPhrases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPhrases = async () => {
      try {
        setLoading(true);
        // If we have a single activity, fetch phrases for that activity
        // If we have multiple activities, fetch phrases for all of them
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
      } catch (err) {
        console.error('Error loading phrases:', err);
        setError('Failed to load phrases. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadPhrases();
  }, [activity, activities]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
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
});

export default PhraseCardScreen; 