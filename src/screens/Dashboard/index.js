import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, spacing, typography } from '../../theme';

const DashboardScreen = () => {
  const selectedActivities = useSelector(state => state.activities.selectedActivities);

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityText}>{item.name}</Text>
      <Text style={styles.progressText}>Progress: 0%</Text>
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
        <Text style={styles.title}>Your Progress Dashboard</Text>
      </View>
      {selectedActivities.length === 0 ? (
        <Text style={styles.noActivitiesText}>No activities selected yet.</Text>
      ) : (
        <FlatList
          data={selectedActivities}
          renderItem={renderActivityItem}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
        />
      )}
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
    width: 100,
    height: 100,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xlarge,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  list: {
    flex: 1,
  },
  activityItem: {
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityText: {
    fontSize: typography.fontSize.medium,
    color: colors.text.primary,
  },
  progressText: {
    fontSize: typography.fontSize.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  noActivitiesText: {
    fontSize: typography.fontSize.medium,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
});

export default DashboardScreen; 