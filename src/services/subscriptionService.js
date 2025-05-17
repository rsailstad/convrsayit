/**
 * Service for handling user subscriptions and feature access
 */

import { supabase } from '../config/supabase';
import { SUBSCRIPTION_TIERS, TIER_PERMISSIONS } from '../constants/app';
import { authService } from './auth';

/**
 * Gets the current user's subscription tier
 * @returns {Promise<string>} The subscription tier (free, basic, premium)
 */
export const getUserSubscriptionTier = async () => {
  try {
    // Get current user
    const user = await authService.getCurrentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get user's subscription data from Supabase
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('tier, valid_until')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching subscription:', error);
      return SUBSCRIPTION_TIERS.FREE; // Default to free tier on error
    }
    
    // If no subscription found, user is on free tier
    if (!data) {
      return SUBSCRIPTION_TIERS.FREE;
    }
    
    // Check if subscription is expired
    const validUntil = new Date(data.valid_until);
    const now = new Date();
    
    if (validUntil < now) {
      return SUBSCRIPTION_TIERS.FREE; // Expired subscription defaults to free
    }
    
    return data.tier;
  } catch (error) {
    console.error('Error in getUserSubscriptionTier:', error);
    return SUBSCRIPTION_TIERS.FREE; // Default to free tier on error
  }
};

/**
 * Checks if the current user has access to a specific feature
 * @param {string} featureName - Name of the feature to check (e.g., 'aiGeneration')
 * @returns {Promise<boolean>} Whether the user has access to the feature
 */
export const hasFeatureAccess = async (featureName) => {
  try {
    const tier = await getUserSubscriptionTier();
    const permissions = TIER_PERMISSIONS[tier] || TIER_PERMISSIONS[SUBSCRIPTION_TIERS.FREE];
    
    return permissions[featureName] === true;
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false; // Default to no access on error
  }
};

/**
 * Upgrades a user's subscription
 * In a real app, this would connect to a payment processor
 * @param {string} tier - The subscription tier to upgrade to
 * @returns {Promise<boolean>} Whether the upgrade was successful
 */
export const upgradeSubscription = async (tier) => {
  try {
    const user = await authService.getCurrentUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Calculate expiration date (1 month from now)
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 1);
    
    // Update or insert subscription record
    const { error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: user.id,
        tier,
        valid_until: validUntil.toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error upgrading subscription:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in upgradeSubscription:', error);
    return false;
  }
};

export const subscriptionService = {
  getUserSubscriptionTier,
  hasFeatureAccess,
  upgradeSubscription
}; 