import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../../services/api';
import { deselectActivity, selectActivity } from '../../store/activitiesSlice';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const selectedActivities = useSelector(state => state.activities.selectedActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const maxSelected = 10;

  useEffect(() => {
    // Fetch activities from the database
    const loadActivities = async () => {
      try {
        const activities = await fetchActivities();
        setAllActivities(activities || []);
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    };
    loadActivities();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = allActivities.filter(
        activity => activity.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedActivities.find(sa => sa.id === activity.id)
      );
      setFilteredActivities(filtered);
    } else {
      setFilteredActivities([]);
    }
  }, [searchQuery, selectedActivities, allActivities]);

  const handleSelectActivity = (activity) => {
    if (selectedActivities.length < maxSelected && !selectedActivities.find(sa => sa.id === activity.id)) {
      dispatch(selectActivity(activity));
      setSearchQuery('');
    } else if (selectedActivities.length >= maxSelected) {
      Alert.alert('Maximum Activities', `You have reached the maximum of ${maxSelected} activities.`);
    }
  };

  const handleDeselectActivity = (activityId) => {
    dispatch(deselectActivity(activityId));
  };

  const renderActivityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.activityItem}
      onPress={() => handleSelectActivity(item)}
    >
      <Text style={styles.activityText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSelectedActivityItem = ({ item }) => (
    <View style={styles.selectedActivityItem}>
      <TouchableOpacity
        onPress={() => Alert.alert('Navigate to PhraseCards for:', item.name)}
      >
        <Text style={styles.selectedActivityText}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleDeselectActivity(item.id)}
        style={styles.deselectButton}
      >
        <Text style={styles.deselectButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/parrot-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to convrSAYit!</Text>
        <Text style={styles.subtitle}>Select your learning activities for today.</Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.sectionTitle}>Find Activities (up to 10)</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="e.g., grocery store, ordering coffee..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredActivities}
          renderItem={renderActivityItem}
          keyExtractor={item => item.id.toString()}
          style={styles.typeaheadList}
        />
        <Text style={styles.selectedCount}>{selectedActivities.length}/10 selected</Text>
      </View>

      <View style={styles.selectedContainer}>
        <Text style={styles.sectionTitle}>Your Daily Activities:</Text>
        {selectedActivities.length === 0 ? (
          <Text style={styles.noActivitiesText}>No activities selected yet. Use the search above to add some!</Text>
        ) : (
          <FlatList
            data={selectedActivities}
            renderItem={renderSelectedActivityItem}
            keyExtractor={item => item.id.toString()}
            style={styles.selectedList}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.startButton, selectedActivities.length === 0 && styles.disabledButton]}
        onPress={() => {
          if (selectedActivities.length > 0) {
            Alert.alert('Navigate to swipeable PhraseCards for all selected activities');
          }
        }}
        disabled={selectedActivities.length === 0}
      >
        <Text style={styles.startButtonText}>Start Today's Phrases (All Selected)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dashboardButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.dashboardButtonText}>View My Progress Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xlarge,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.medium,
    color: colors.text.secondary,
  },
  searchContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  typeaheadList: {
    maxHeight: 200,
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.medium,
    ...shadows.small,
  },
  activityItem: {
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityText: {
    fontSize: typography.fontSize.medium,
    color: colors.text.primary,
  },
  selectedCount: {
    fontSize: typography.fontSize.small,
    color: colors.text.secondary,
    textAlign: 'right',
  },
  selectedContainer: {
    marginBottom: spacing.lg,
  },
  selectedList: {
    maxHeight: 200,
  },
  selectedActivityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: spacing.sm,
    borderRadius: borderRadius.medium,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  selectedActivityText: {
    fontSize: typography.fontSize.medium,
    color: colors.primary,
  },
  deselectButton: {
    padding: spacing.xs,
  },
  deselectButtonText: {
    fontSize: typography.fontSize.large,
    color: colors.text.accent,
  },
  noActivitiesText: {
    fontSize: typography.fontSize.medium,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  startButtonText: {
    color: colors.cardBackground,
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.bold,
  },
  disabledButton: {
    opacity: 0.5,
  },
  dashboardButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
  },
  dashboardButtonText: {
    color: colors.cardBackground,
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.bold,
  },
});

export default HomeScreen; 