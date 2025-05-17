import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SUBSCRIPTION_TIERS } from '../constants/app';
import { subscriptionService } from '../services/subscriptionService';

export interface FeatureAccess {
  aiGeneration: boolean;
  maxPhrasecardsPerDay: number;
  offlineAccess: boolean;
}

export interface SubscriptionState {
  tier: string;
  loading: boolean;
  error: string | null;
  featureAccess: FeatureAccess;
}

// Async thunks
export const fetchUserSubscription = createAsyncThunk(
  'subscription/fetchUserSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const tier = await subscriptionService.getUserSubscriptionTier();
      return { tier };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const upgradeUserSubscription = createAsyncThunk(
  'subscription/upgradeUserSubscription',
  async (tier: string, { rejectWithValue }) => {
    try {
      const success = await subscriptionService.upgradeSubscription(tier);
      if (!success) {
        throw new Error('Failed to upgrade subscription');
      }
      return { tier };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkFeatureAccess = createAsyncThunk(
  'subscription/checkFeatureAccess',
  async (featureName: keyof FeatureAccess, { rejectWithValue }) => {
    try {
      const hasAccess = await subscriptionService.hasFeatureAccess(featureName);
      return { featureName, hasAccess };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: SubscriptionState = {
  tier: SUBSCRIPTION_TIERS.FREE,
  loading: false,
  error: null,
  featureAccess: {
    aiGeneration: false,
    maxPhrasecardsPerDay: 10,
    offlineAccess: false
  }
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSubscription: (state) => {
      state.tier = SUBSCRIPTION_TIERS.FREE;
      state.featureAccess = initialState.featureAccess;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user subscription
      .addCase(fetchUserSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.tier = action.payload.tier;
      })
      .addCase(fetchUserSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Upgrade subscription
      .addCase(upgradeUserSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upgradeUserSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.tier = action.payload.tier;
      })
      .addCase(upgradeUserSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Check feature access
      .addCase(checkFeatureAccess.fulfilled, (state, action) => {
        const { featureName, hasAccess } = action.payload;
        if (featureName in state.featureAccess) {
          state.featureAccess[featureName] = hasAccess;
        }
      });
  }
});

export const { clearError, resetSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 