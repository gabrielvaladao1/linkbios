-- Migration: Add social_links column to users table
-- This stores an array of social platform links as JSON

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS social_links JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.users.social_links IS 'Array of {platform, url} objects for social media icons';
