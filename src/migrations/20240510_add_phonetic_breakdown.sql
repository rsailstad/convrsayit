-- Migration to add phonetic_breakdown column
ALTER TABLE phrasecards
ADD COLUMN IF NOT EXISTS phonetic_breakdown TEXT; 