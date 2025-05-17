import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { SUBSCRIPTION_TIERS } from '../../constants/app';
import { upgradeUserSubscription } from '../../store/subscriptionSlice';
import { colors, spacing, typography } from '../../theme';

interface SubscriptionUpgradePromptProps {
  feature: string;
  onContinueWithBasic?: () => void;
}

const SubscriptionUpgradePrompt: React.FC<SubscriptionUpgradePromptProps> = ({
  feature,
  onContinueWithBasic,
}) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();

  const handleUpgrade = async (tier: string) => {
    try {
      await dispatch(upgradeUserSubscription(tier));
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade Your Subscription</Text>
      
      <Text style={styles.description}>
        {feature} is available on our Basic and Premium plans.
        Upgrade now to access this feature and many more.
      </Text>
      
      <View style={styles.pricingCards}>
        <View style={[styles.pricingCard, styles.basicCard]}>
          <Text style={styles.tierTitle}>Basic</Text>
          <Text style={styles.price}>$4.99/month</Text>
          <Text style={styles.featureText}>• AI-generated phrases</Text>
          <Text style={styles.featureText}>• 30 phrases per day</Text>
          <Text style={styles.featureText}>• Offline access</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.basicButton]}
            onPress={() => handleUpgrade(SUBSCRIPTION_TIERS.BASIC)}
          >
            <Text style={styles.buttonText}>Get Basic</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.pricingCard, styles.premiumCard]}>
          <Text style={styles.tierTitle}>Premium</Text>
          <Text style={styles.price}>$9.99/month</Text>
          <Text style={styles.featureText}>• Unlimited AI phrases</Text>
          <Text style={styles.featureText}>• All languages</Text>
          <Text style={styles.featureText}>• Advanced grammar tips</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.premiumButton]}
            onPress={() => handleUpgrade(SUBSCRIPTION_TIERS.PREMIUM)}
          >
            <Text style={styles.buttonText}>Get Premium</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {onContinueWithBasic && (
        <TouchableOpacity style={styles.skipButton} onPress={onContinueWithBasic}>
          <Text style={styles.skipText}>Continue with basic features</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.large,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text.primary,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.fontSize.medium,
    marginBottom: spacing.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  pricingCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
  },
  pricingCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  basicCard: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  premiumCard: {
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
  tierTitle: {
    fontSize: typography.fontSize.medium,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  price: {
    fontSize: typography.fontSize.small,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  featureText: {
    fontSize: typography.fontSize.small,
    marginBottom: spacing.xs,
    color: colors.text.secondary,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    marginTop: spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  basicButton: {
    backgroundColor: 'rgba(52, 152, 219, 1)',
  },
  premiumButton: {
    backgroundColor: 'rgba(155, 89, 182, 1)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: typography.fontSize.small,
  },
  skipButton: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  skipText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.small,
    textDecorationLine: 'underline',
  }
});

export default SubscriptionUpgradePrompt; 