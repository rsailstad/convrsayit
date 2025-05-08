-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    native_language TEXT NOT NULL,
    learning_level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Phrase Packs table
CREATE TABLE IF NOT EXISTS PhrasePacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pack_name TEXT NOT NULL,
    description TEXT,
    target_level TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Phrase Cards table
CREATE TABLE IF NOT EXISTS PhraseCards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pack_id UUID REFERENCES PhrasePacks(id) ON DELETE CASCADE,
    romanian_phrase TEXT NOT NULL,
    english_translation TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty_level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Progress table
CREATE TABLE IF NOT EXISTS UserProgress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    card_id UUID REFERENCES PhraseCards(id) ON DELETE CASCADE,
    mastery_level INTEGER DEFAULT 0,
    last_reviewed TIMESTAMP WITH TIME ZONE,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, card_id)
);

-- Daily Challenges table
CREATE TABLE IF NOT EXISTS DailyChallenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
    card_id UUID REFERENCES PhraseCards(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, card_id, assigned_date)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON Users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phrase_packs_updated_at
    BEFORE UPDATE ON PhrasePacks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phrase_cards_updated_at
    BEFORE UPDATE ON PhraseCards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON UserProgress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_challenges_updated_at
    BEFORE UPDATE ON DailyChallenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_phrase_cards_pack_id ON PhraseCards(pack_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON UserProgress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_card_id ON UserProgress(card_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_user_id ON DailyChallenges(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_card_id ON DailyChallenges(card_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_assigned_date ON DailyChallenges(assigned_date); 