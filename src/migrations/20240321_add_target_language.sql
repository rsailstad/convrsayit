-- Migration to add target_language column
BEGIN;

-- Add target_language column
ALTER TABLE phrasecards
ADD COLUMN IF NOT EXISTS target_language TEXT DEFAULT 'Romanian';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_phrasecards_target_language ON phrasecards(target_language);

-- Add constraint to ensure valid language codes
ALTER TABLE phrasecards
ADD CONSTRAINT valid_target_language 
CHECK (target_language IN ('Romanian', 'Spanish', 'French', 'German', 'Italian'));

COMMIT; 