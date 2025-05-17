import React, { useEffect, useState } from 'react';
import { Alert, Clipboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AuthForm from '../../components/AuthForm';
import LanguageSelector from '../../components/LanguageSelector';
import SubscriptionUpgradePrompt from '../../components/SubscriptionUpgradePrompt';
import { SUBSCRIPTION_TIERS } from '../../constants/app';
import { fetchUserProgress, updateUserLanguage } from '../../services/api';
import { checkSession } from '../../store/authSlice';
import { fetchUserSubscription } from '../../store/subscriptionSlice';
import { colors, spacing, typography } from '../../theme';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  const { tier: subscriptionTier, featureAccess } = useSelector(state => state.subscription);
  const [userLanguage, setUserLanguage] = useState('Romanian');
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    // Check for existing session on mount
    dispatch(checkSession());
    
    // Fetch subscription status
    if (isAuthenticated) {
      dispatch(fetchUserSubscription());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (user?.id) {
      loadUserProgress();
    }
  }, [userLanguage, user?.id]);

  const loadUserProgress = async () => {
    if (!user?.id) {
      console.warn('No user ID available');
      return;
    }

    try {
      setIsLoading(true);
      const userProgress = await fetchUserProgress(user.id, userLanguage);
      setProgress(userProgress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    if (!user?.id) {
      return;
    }

    try {
      setIsLoading(true);
      await updateUserLanguage(user.id, newLanguage);
      setUserLanguage(newLanguage);
    } catch (error) {
      console.error('Error updating language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const renderAccountSection = () => {
    if (!user) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.accountInfo}>
          <View style={styles.accountField}>
            <Text style={styles.accountLabel}>User ID:</Text>
            <Text style={styles.accountValue}>{user.id}</Text>
            <TouchableOpacity 
              style={styles.copyButton}
              onPress={() => copyToClipboard(user.id)}
            >
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
          {copySuccess ? <Text style={styles.copySuccess}>{copySuccess}</Text> : null}
          
          <View style={styles.accountField}>
            <Text style={styles.accountLabel}>Email:</Text>
            <Text style={styles.accountValue}>{user.email}</Text>
          </View>
          
          <View style={styles.accountField}>
            <Text style={styles.accountLabel}>Account Created:</Text>
            <Text style={styles.accountValue}>
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          
          <Text style={styles.accountNote}>
            Use your User ID to add subscription records in the database for testing.
          </Text>
        </View>
      </View>
    );
  };

  const renderProgressSection = () => {
    if (!progress) return null;

    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Your Progress</Text>
        <View style={styles.progressStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress.completedPhrases || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{progress.totalPhrases || 0}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {progress.completedPhrases && progress.totalPhrases
                ? Math.round((progress.completedPhrases / progress.totalPhrases) * 100)
                : 0}%
            </Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress.completedPhrases && progress.totalPhrases
                  ? (progress.completedPhrases / progress.totalPhrases) * 100
                  : 0}%`,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderSubscriptionSection = () => {
    const subscriptionInfo = {
      [SUBSCRIPTION_TIERS.FREE]: {
        title: 'Free Plan',
        color: '#95a5a6',
        description: 'Access to basic phrasecards and limited features.',
        features: ['Access to pre-made phrasecards', 'Up to 10 phrasecards per day', 'Basic progress tracking']
      },
      [SUBSCRIPTION_TIERS.BASIC]: {
        title: 'Basic Plan',
        color: '#3498db',
        description: 'Access to AI-generated phrases and more daily content.',
        features: ['AI-generated phrasecards', 'Up to 30 phrasecards per day', 'Offline access', 'Advanced progress tracking']
      },
      [SUBSCRIPTION_TIERS.PREMIUM]: {
        title: 'Premium Plan',
        color: '#9b59b6',
        description: 'Unlimited access to all features and content.',
        features: ['Unlimited AI-generated phrasecards', 'All languages', 'Advanced grammar tips', 'Priority support']
      }
    };

    const currentPlan = subscriptionInfo[subscriptionTier] || subscriptionInfo[SUBSCRIPTION_TIERS.FREE];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Subscription</Text>
        
        <View style={[styles.subscriptionCard, { borderColor: currentPlan.color }]}>
          <View style={[styles.subscriptionBadge, { backgroundColor: currentPlan.color }]}>
            <Text style={styles.subscriptionBadgeText}>{currentPlan.title}</Text>
          </View>
          
          <Text style={styles.subscriptionDescription}>{currentPlan.description}</Text>
          
          <View style={styles.featuresList}>
            {currentPlan.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>•</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
          
          {subscriptionTier === SUBSCRIPTION_TIERS.FREE && (
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => setShowUpgradeModal(true)}
            >
              <Text style={styles.upgradeButtonText}>Upgrade Your Plan</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (!isAuthenticated) {
    return (
      <ScrollView style={styles.container}>
        <AuthForm />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {renderAccountSection()}

      {renderSubscriptionSection()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Language</Text>
        <Text style={styles.sectionDescription}>
          Select the language you want to learn. All phrases will be shown in English and your selected language.
        </Text>
        <LanguageSelector
          userId={user?.id}
          currentLanguage={userLanguage}
          onLanguageChange={handleLanguageChange}
          disabled={isLoading}
        />
      </View>

      {renderProgressSection()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => Alert.alert('Coming Soon', 'Account settings will be available soon!')}
        >
          <Text style={styles.settingButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon!')}
        >
          <Text style={styles.settingButtonText}>Notification Settings</Text>
        </TouchableOpacity>
      </View>

      {showUpgradeModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <SubscriptionUpgradePrompt 
              feature="premium features"
              onContinueWithBasic={() => setShowUpgradeModal(false)}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSize.xlarge,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  section: {
    backgroundColor: colors.white,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: typography.fontSize.medium,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  accountInfo: {
    marginTop: spacing.sm,
  },
  accountField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  accountLabel: {
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    width: 120,
  },
  accountValue: {
    fontSize: typography.fontSize.medium,
    color: colors.text.secondary,
    flex: 1,
  },
  accountNote: {
    fontSize: typography.fontSize.small,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  copyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },
  copyButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.bold,
  },
  copySuccess: {
    color: 'green',
    fontSize: typography.fontSize.small,
    marginBottom: spacing.sm,
  },
  progressContainer: {
    backgroundColor: colors.white,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.md,
    padding: spacing.lg,
    borderRadius: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: typography.fontSize.large,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.xlarge,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.fontSize.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  settingButton: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  settingButtonText: {
    fontSize: typography.fontSize.medium,
    color: colors.text.primary,
  },
  subscriptionCard: {
    borderWidth: 2,
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    position: 'relative',
    paddingTop: spacing.xl * 1.5,
  },
  subscriptionBadge: {
    position: 'absolute',
    top: -15,
    left: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  subscriptionBadgeText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.medium,
  },
  subscriptionDescription: {
    fontSize: typography.fontSize.medium,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  featuresList: {
    marginBottom: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  featureIcon: {
    fontSize: typography.fontSize.medium,
    marginRight: spacing.sm,
    color: colors.text.secondary,
  },
  featureText: {
    fontSize: typography.fontSize.medium,
    color: colors.text.secondary,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.bold,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
  },
});

export default ProfileScreen; 