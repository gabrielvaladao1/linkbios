-- Migration: Add pixel tracking fields to users table
-- These fields store Meta (Facebook) and TikTok pixel IDs for conversion tracking

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS meta_pixel_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS tiktok_pixel_id VARCHAR(50);

-- Comment for documentation
COMMENT ON COLUMN public.users.meta_pixel_id IS 'Meta (Facebook) Pixel ID for conversion tracking';
COMMENT ON COLUMN public.users.tiktok_pixel_id IS 'TikTok Pixel ID for conversion tracking';
