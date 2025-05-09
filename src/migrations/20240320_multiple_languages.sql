-- Migration for Multiple Language Support
-- This migration adds support for multiple languages while maintaining backward compatibility

BEGIN;

-- Verify tables exist before modifying
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        RAISE EXCEPTION 'Users table does not exist';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'phrasepacks') THEN
        RAISE EXCEPTION 'PhrasePacks table does not exist';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'phrasecards') THEN
        RAISE EXCEPTION 'PhraseCards table does not exist';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'userprogress') THEN
        RAISE EXCEPTION 'UserProgress table does not exist';
    END IF;
END $$;

-- Add learning_language to Users table
ALTER TABLE Users 
ADD COLUMN IF NOT EXISTS learning_language TEXT DEFAULT 'Romanian';

-- Add target_language to PhrasePacks table
ALTER TABLE PhrasePacks 
ADD COLUMN IF NOT EXISTS target_language TEXT DEFAULT 'Romanian';

-- Rename columns in PhraseCards table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'phrasecards' AND column_name = 'romanian_phrase') THEN
        ALTER TABLE PhraseCards RENAME COLUMN romanian_phrase TO english_phrase;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'phrasecards' AND column_name = 'english_translation') THEN
        ALTER TABLE PhraseCards RENAME COLUMN english_translation TO translated_phrase;
    END IF;
END $$;

-- Add language column to UserProgress table
ALTER TABLE UserProgress 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Romanian';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_learning_language ON Users(learning_language);
CREATE INDEX IF NOT EXISTS idx_phrasepacks_target_language ON PhrasePacks(target_language);
CREATE INDEX IF NOT EXISTS idx_userprogress_language ON UserProgress(language);

-- Update existing data to maintain backward compatibility
UPDATE Users SET learning_language = 'Romanian' WHERE learning_language IS NULL;
UPDATE PhrasePacks SET target_language = 'Romanian' WHERE target_language IS NULL;
UPDATE UserProgress SET language = 'Romanian' WHERE language IS NULL;

-- Add constraint to ensure valid language codes
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_learning_language') THEN
        ALTER TABLE Users 
        ADD CONSTRAINT valid_learning_language 
        CHECK (learning_language IN ('Romanian', 'Spanish', 'French', 'German', 'Italian'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_target_language') THEN
        ALTER TABLE PhrasePacks 
        ADD CONSTRAINT valid_target_language 
        CHECK (target_language IN ('Romanian', 'Spanish', 'French', 'German', 'Italian'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_language') THEN
        ALTER TABLE UserProgress 
        ADD CONSTRAINT valid_language 
        CHECK (language IN ('Romanian', 'Spanish', 'French', 'German', 'Italian'));
    END IF;
END $$;

-- Verify the changes
DO $$
BEGIN
    -- Verify columns exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'learning_language') THEN
        RAISE EXCEPTION 'Failed to add learning_language to Users table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'phrasepacks' AND column_name = 'target_language') THEN
        RAISE EXCEPTION 'Failed to add target_language to PhrasePacks table';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'userprogress' AND column_name = 'language') THEN
        RAISE EXCEPTION 'Failed to add language to UserProgress table';
    END IF;
    
    -- Verify constraints exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_learning_language') THEN
        RAISE EXCEPTION 'Failed to add valid_learning_language constraint';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_target_language') THEN
        RAISE EXCEPTION 'Failed to add valid_target_language constraint';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_language') THEN
        RAISE EXCEPTION 'Failed to add valid_language constraint';
    END IF;
END $$;

COMMIT; 