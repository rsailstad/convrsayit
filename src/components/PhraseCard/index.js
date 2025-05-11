import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, LayoutAnimation, PanResponder, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
const CARD_WIDTH = SCREEN_WIDTH - 40; // Width of the card with padding

// Placeholder for icons, e.g., from expo-vector-icons
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Example icon import

const PhraseCard = ({ phraseData, targetLanguage = 'Romanian', currentIndex = 0, totalPhrases = 1, onNext, onPrevious }) => {
  const [isGrammarExpanded, setIsGrammarExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0); // 0 for no rating, 1-5 for stars
  const [showJoke, setShowJoke] = useState(false);
  const [isPhoneticExpanded, setIsPhoneticExpanded] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;
  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp'
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp'
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    const item = direction === 'right' ? onPrevious : onNext;
    item && item();
    position.setValue({ x: 0, y: 0 });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false
    }).start();
  };

  const getCardStyle = () => {
    return {
      ...position.getLayout(),
      transform: [] // Remove rotation transform
    };
  };

  // Default data if phraseData is not provided
  const defaultPhrase = {
    id: 'default1',
    english_phrase: 'Hello, how are you?',
    translated_phrase: 'Salut, ce faci?',
    grammar: 'This is a common greeting. "Ce" means "what", "faci" means "you do/are doing".',
    joke: 'Salut, șefu\'! Ai un leu?', // Example joke/slang
    category: 'Greetings',
    level: 'Beginner',
  };

  const currentPhrase = phraseData || defaultPhrase;

  const toggleGrammar = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsGrammarExpanded(!isGrammarExpanded);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log(isFavorite ? 'Removed from Favorites' : 'Added to Favorites');
  };

  const handleSetRating = (newRating) => {
    setRating(newRating);
    console.log(`Rated as ${newRating} stars`);
  };

  const handleToggleJoke = () => {
    setShowJoke(!showJoke);
  };

  const togglePhonetic = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsPhoneticExpanded(!isPhoneticExpanded);
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.cardContainer,
          getCardStyle(),
          { zIndex: 1 }
        ]} 
        {...panResponder.panHandlers}
      >
        {/* App Logo */}
        <View style={{ alignItems: 'center' }}>
          <Image source={require('../../assets/parrot-logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        {/* 1 of N Indicator */}
        {totalPhrases > 1 && (
          <Text style={styles.cardCount}>
            {currentIndex + 1} of {totalPhrases}
          </Text>
        )}
        <Text style={styles.translatedText}>
          {showJoke ? currentPhrase.joke : currentPhrase.translated_phrase}
        </Text>
        {!showJoke && (
          <Text style={styles.englishText}>{currentPhrase.english_phrase}</Text>
        )}

        {/* Phonetic Breakdown (Collapsible) */}
        {!showJoke && (
          <TouchableOpacity onPress={togglePhonetic} activeOpacity={0.7}>
            <View style={styles.phoneticHeader}>
              <Text style={styles.phoneticTitle}>Phonetic Notes</Text>
              <Text>{isPhoneticExpanded ? 'Hide' : 'Show'}</Text>
            </View>
          </TouchableOpacity>
        )}
        {isPhoneticExpanded && !showJoke && (
          <View style={styles.phoneticContent}>
            <Text>{currentPhrase.phonetic}</Text>
          </View>
        )}

        {/* Grammar/Syntax Breakdown (Collapsible) */}
        {!showJoke && (
          <TouchableOpacity onPress={toggleGrammar} activeOpacity={0.7}>
            <View style={styles.grammarHeader}>
              <Text style={styles.grammarTitle}>Grammar Notes</Text>
              {/* <Ionicons name={isGrammarExpanded ? "chevron-up" : "chevron-down"} size={20} color="#4A90E2" /> */}
              <Text>{isGrammarExpanded ? 'Hide' : 'Show'}</Text>
            </View>
          </TouchableOpacity>
        )}
        {isGrammarExpanded && !showJoke && (
          <View style={styles.grammarContent}>
            <Text>{currentPhrase.grammar}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => console.log('TTS Placeholder for:', currentPhrase.translated_phrase)}
          >
            {/* <Ionicons name="volume-medium-outline" size={24} color="#4A90E2" /> */}
            <Text style={styles.actionButtonText}>Hear</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => console.log(`Marked "${currentPhrase.translated_phrase}" as Used`)}
          >
            <Text style={styles.actionButtonText}>Used It!</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => console.log(`Marked "${currentPhrase.translated_phrase}" as Reviewed`)}
          >
            <Text style={styles.actionButtonText}>Reviewed</Text>
          </TouchableOpacity>
        </View>

        {/* Rating System */}
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>Rate Usefulness: </Text>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleSetRating(star)}>
              {/* <MaterialCommunityIcons name={star <= rating ? "star" : "star-outline"} size={28} color="#FFD700" /> */}
              <Text style={star <= rating ? styles.starFilled : styles.starOutline}>★</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.secondaryActionsContainer}>
          <TouchableOpacity style={styles.secondaryActionButton} onPress={handleToggleFavorite}>
            {/* <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#E91E63" : "#555"} /> */}
            <Text style={styles.secondaryActionText}>{isFavorite ? 'Favorited' : 'Favorite'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionButton} onPress={handleToggleJoke}>
            {/* <Ionicons name="happy-outline" size={24} color="#F5A623" /> */}
            <Text style={styles.secondaryActionText}>{showJoke ? 'Show Original' : 'Laugh'}</Text>
          </TouchableOpacity>
        </View>

        {/* AI Follow-up */}
        <TouchableOpacity 
          style={styles.aiButton} 
          onPress={() => console.log('OpenAI Follow-up for:', currentPhrase.translated_phrase)}
        >
          <Text style={styles.aiButtonText}>Ask a follow-up (AI)</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Next Card Preview */}
      <Animated.View 
        style={[
          styles.cardContainer,
          styles.nextCard,
          {
            opacity: nextCardOpacity,
            transform: [{ scale: nextCardScale }]
          }
        ]}
      >
        <View style={styles.nextCardContent}>
          <Text style={styles.nextCardText}>Next Card</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  nextCard: {
    backgroundColor: '#F5F5F5',
    zIndex: 0,
  },
  nextCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextCardText: {
    color: '#999',
    fontSize: 16,
  },
  translatedText: {
    fontSize: 22, // Larger for emphasis
    fontWeight: 'bold',
    color: '#2c3e50', // Dark blue-grey for text
    marginBottom: 8,
    textAlign: 'center',
  },
  englishText: {
    fontSize: 16,
    color: '#7f8c8d', // Lighter grey for translation
    marginBottom: 15,
    textAlign: 'center',
  },
  phoneticHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1', // Light separator line
    marginTop: 10,
  },
  phoneticTitle: {
    fontWeight: '600',
    color: '#16a34a', // Green for phonetic
    fontSize: 16,
  },
  phoneticContent: {
    padding: 10,
    backgroundColor: '#f0fdf4', // Very light green for content background
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 15,
  },
  grammarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1', // Light separator line
    marginTop: 10,
  },
  grammarTitle: {
    fontWeight: '600',
    color: '#3498db', // Blue for interactive elements
    fontSize: 16,
  },
  grammarContent: {
    padding: 10,
    backgroundColor: '#f8f9fa', // Very light grey for content background
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    color: '#2980b9', // Slightly darker blue for action text
    fontSize: 14,
    marginTop: 4, // If using icons
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  ratingText: {
    marginRight: 10,
    fontSize: 16,
    color: '#34495e',
  },
  starOutline: {
    fontSize: 28,
    color: '#bdc3c7', // Light grey for outline star
  },
  starFilled: {
    fontSize: 28,
    color: '#f1c40f', // Yellow for filled star
  },
  secondaryActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  secondaryActionButton: {
    alignItems: 'center',
    padding: 8,
  },
  secondaryActionText: {
    color: '#8e44ad', // Purple for secondary actions
    fontSize: 14,
    marginTop: 4, // If using icons
  },
  aiButton: {
    backgroundColor: '#1abc9c', // Teal for AI button (cheerful)
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25, // Rounded button
    alignItems: 'center',
    marginTop: 10,
  },
  aiButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardCount: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
});

export default PhraseCard;

