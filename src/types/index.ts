/**
 * TypeScript type definitions for the application
 */

// Activity types
export interface Activity {
  id: string;
  name: string;
  category: string;
  is_active: boolean;
  difficulty_level?: string;
  icon_name?: string;
  created_at?: string;
  updated_at?: string;
}

// Phrase types
export interface PhraseCard {
  id: string;
  card_id?: string;
  english_phrase: string;
  native_phrase?: string;
  translated_phrase: string;
  category: string;
  activity?: string;
  difficulty_level?: string;
  target_language?: string;
  grammar_breakdown?: string;
  grammar_tip?: string;
  joke_slang_alternative?: string;
  slang_version?: string;
  phonetic_breakdown?: string;
  phonetic?: string;
  created_at?: string;
  updated_at?: string;
}

// UI-ready phrase type
export interface UIPhraseCard {
  id: string;
  english_phrase: string;
  translated_phrase: string;
  category: string;
  level: string;
  grammar: string;
  joke: string;
  phonetic: string;
}

// User progress types
export interface UserProgress {
  id?: string;
  user_id: string;
  card_id: string;
  language: string;
  reviewed_count?: number;
  used_count?: number;
  is_favorite?: boolean;
  mastery_level?: number;
  last_reviewed_at?: string;
  created_at?: string;
  updated_at?: string;
}

// AI-generated phrase types
export interface AIGeneratedPhrase {
  activity: string;
  native_phrase: string;
  translated_phrase: string;
  phonetic: string;
  grammar_tip: string;
  slang_version: string;
}

// API service types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

// Filter types
export interface PhraseFilters {
  category?: string;
  difficulty_level?: string;
  pack_id?: string;
  target_language?: string;
}

// Route param types
export interface PhraseCardScreenParams {
  activity?: Activity;
  activities?: Activity[];
  mode?: 'static' | 'dynamic';
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  native_language?: string;
  learning_language?: string;
  created_at?: string;
  updated_at?: string;
}

// App state types
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  // Add additional slices as needed
} 