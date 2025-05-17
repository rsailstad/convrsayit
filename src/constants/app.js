/**
 * Application-wide constants
 * Centralizing these values helps prevent typos and makes updates easier
 */

// Supported languages
export const LANGUAGES = {
  // Source/Native languages
  ENGLISH: 'English',
  SPANISH: 'Spanish',
  FRENCH: 'French',
  
  // Target languages
  ROMANIAN: 'Romanian',
  ITALIAN: 'Italian',
  JAPANESE: 'Japanese',
  THAI: 'Thai',
  GERMAN: 'German',
};

// Default language settings
export const DEFAULT_NATIVE_LANGUAGE = LANGUAGES.ENGLISH;
export const DEFAULT_TARGET_LANGUAGE = LANGUAGES.ROMANIAN;

// Phrase difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  AI_GENERATED: 'AI Generated',
};

// API endpoints (for consistent reference)
export const API_ENDPOINTS = {
  PHRASE_CARDS: 'phrasecards',
  ACTIVITIES: 'activities',
  USER_PROGRESS: 'userprogress',
  PHRASE_PACKS: 'phrasepacks',
  DAILY_CHALLENGES: 'dailychallenges',
};

// Phrasecard generation modes
export const GENERATION_MODES = {
  STATIC: 'static',
  DYNAMIC: 'dynamic',
};

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
};

// Features allowed per subscription tier
export const TIER_PERMISSIONS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    aiGeneration: false,
    maxPhrasecardsPerDay: 10,
    offlineAccess: false,
  },
  [SUBSCRIPTION_TIERS.BASIC]: {
    aiGeneration: true,
    maxPhrasecardsPerDay: 30,
    offlineAccess: true,
  },
  [SUBSCRIPTION_TIERS.PREMIUM]: {
    aiGeneration: true,
    maxPhrasecardsPerDay: -1, // unlimited
    offlineAccess: true,
  },
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  SELECTED_LANGUAGE: 'selected_language',
  OPENAI_API_KEY: 'openai_api_key',
};

// Default pagination values
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
};

// App routes - for consistent navigation references
export const ROUTES = {
  HOME: 'Home',
  PROFILE: 'Profile',
  PHRASE_CARD: 'PhraseCard',
  DASHBOARD: 'Dashboard',
  SETTINGS: 'Settings',
}; 