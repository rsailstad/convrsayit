-- Migration to add grammar breakdown and joke/slang columns
BEGIN;

-- Add grammar_breakdown column
ALTER TABLE phrasecards
ADD COLUMN IF NOT EXISTS grammar_breakdown TEXT;

-- Add joke_slang_alternative column
ALTER TABLE phrasecards
ADD COLUMN IF NOT EXISTS joke_slang_alternative TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_phrasecards_grammar ON phrasecards(grammar_breakdown);
CREATE INDEX IF NOT EXISTS idx_phrasecards_joke ON phrasecards(joke_slang_alternative);

COMMIT; 