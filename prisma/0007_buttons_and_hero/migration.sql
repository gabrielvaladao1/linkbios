-- Migration: Granular button styling + Hero header layout (B1 + B2)
-- B1: separa estilo de botão do template (style + roundness + shadow editáveis pelo usuário)
-- B2: opção de header "Hero" (banner grande) além do "Classic" (avatar redondo)

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS button_style     TEXT NOT NULL DEFAULT 'solid',
  ADD COLUMN IF NOT EXISTS button_roundness TEXT NOT NULL DEFAULT 'round',
  ADD COLUMN IF NOT EXISTS button_shadow    TEXT NOT NULL DEFAULT 'soft',
  ADD COLUMN IF NOT EXISTS header_layout    TEXT NOT NULL DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS banner_url       TEXT;

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_button_style_check,
  DROP CONSTRAINT IF EXISTS users_button_roundness_check,
  DROP CONSTRAINT IF EXISTS users_button_shadow_check,
  DROP CONSTRAINT IF EXISTS users_header_layout_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_button_style_check
    CHECK (button_style IN ('solid', 'glass', 'outline')),
  ADD CONSTRAINT users_button_roundness_check
    CHECK (button_roundness IN ('square', 'round', 'rounder', 'full')),
  ADD CONSTRAINT users_button_shadow_check
    CHECK (button_shadow IN ('none', 'soft', 'strong', 'hard')),
  ADD CONSTRAINT users_header_layout_check
    CHECK (header_layout IN ('classic', 'hero'));

COMMENT ON COLUMN public.users.button_style     IS 'Button visual style: solid | glass | outline';
COMMENT ON COLUMN public.users.button_roundness IS 'Corner radius: square | round | rounder | full';
COMMENT ON COLUMN public.users.button_shadow    IS 'Shadow intensity: none | soft | strong | hard';
COMMENT ON COLUMN public.users.header_layout    IS 'Header layout: classic (round avatar) | hero (banner + avatar)';
COMMENT ON COLUMN public.users.banner_url       IS 'Banner image URL for hero layout (Supabase Storage public URL)';
