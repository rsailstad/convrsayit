-- PostgreSQL Schema for convrSAYit App

-- Users Table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    native_language VARCHAR(50) DEFAULT 'English',
    learning_level VARCHAR(50) CHECK (learning_level IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner', -- Added 'Advanced' as a potential level
    phrase_pack_focus VARCHAR(255), -- Can be a comma-separated list or normalized later
    enable_slang_fun_phrases BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PhrasePacks Table (Optional, if phrases are bundled)
-- If not using packs, phrases can be directly categorized in PhraseCards
CREATE TABLE PhrasePacks (
    pack_id SERIAL PRIMARY KEY,
    pack_name VARCHAR(255) NOT NULL,
    description TEXT,
    target_language VARCHAR(50) DEFAULT 'Romanian' NOT NULL, -- Added target language
    source_language VARCHAR(50) DEFAULT 'English' NOT NULL, -- Added source language for future expansion
    target_level VARCHAR(50) CHECK (target_level IN ('Beginner', 'Intermediate', 'Advanced')),
    category VARCHAR(100), -- e.g., Daily Life, Business, Travel
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PhraseCards Table
CREATE TABLE PhraseCards (
    card_id SERIAL PRIMARY KEY,
    pack_id INTEGER, -- Foreign Key to PhrasePacks, can be NULL if phrases are not always in packs
    romanian_phrase TEXT NOT NULL,
    english_translation TEXT NOT NULL,
    phonetic_breakdown TEXT,
    grammar_breakdown TEXT,
    joke_slang_alternative TEXT,
    audio_url_tts TEXT, -- URL or identifier for TTS
    category VARCHAR(100) NOT NULL, -- e.g., Greetings, Shopping, Dining, Transport
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'Easy', 'Medium', 'Hard')), -- More granular difficulty
    tags TEXT, -- Comma-separated tags for searchability
    created_by INTEGER, -- Optional: user_id if community submissions are allowed later
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pack_id) REFERENCES PhrasePacks(pack_id) ON DELETE SET NULL, -- Allow phrases to exist without a pack
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- UserProgress Table
CREATE TABLE UserProgress (
    progress_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    status VARCHAR(50) CHECK (status IN ('not_seen', 'seen', 'reviewed', 'mastered', 'used_in_real_life')) DEFAULT 'not_seen',
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    marked_as_used_at TIMESTAMP WITH TIME ZONE,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    is_favorite BOOLEAN DEFAULT FALSE,
    times_reviewed INTEGER DEFAULT 0,
    times_marked_as_used INTEGER DEFAULT 0,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- For spaced repetition (optional future feature)
    -- next_review_due_at TIMESTAMP WITH TIME ZONE,
    -- interval INTEGER, -- in days
    -- ease_factor REAL,
    notes TEXT, -- User's personal notes on the phrase
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, card_id), -- Ensure one progress entry per user per card
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES PhraseCards(card_id) ON DELETE CASCADE
);

-- DailyChallenge Table (To manage daily phrases for users)
CREATE TABLE DailyChallenges (
    challenge_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) CHECK (status IN ('pending', 'completed', 'skipped')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, assigned_date, card_id), -- Avoid assigning same card on same day to same user, or allow multiple via different primary key
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES PhraseCards(card_id) ON DELETE CASCADE
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to tables that have updated_at
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON Users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_phrasepacks
BEFORE UPDATE ON PhrasePacks
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_phrasecards
BEFORE UPDATE ON PhraseCards
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_userprogress
BEFORE UPDATE ON UserProgress
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Indexes for performance
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_phrasecards_category ON PhraseCards(category);
CREATE INDEX idx_phrasecards_difficulty ON PhraseCards(difficulty_level);
CREATE INDEX idx_userprogress_user_card ON UserProgress(user_id, card_id);
CREATE INDEX idx_dailychallenges_user_date ON DailyChallenges(user_id, assigned_date);


