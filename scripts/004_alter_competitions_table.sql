-- Step 1: Add edition column to competitions table
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS edition INTEGER DEFAULT 1;

-- Add poster_image column for competition poster
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS poster_image TEXT;

-- Add video_url column for competition video
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add philosophy and purpose columns
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS philosophy TEXT;
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS purpose TEXT;
