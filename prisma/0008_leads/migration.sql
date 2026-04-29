-- Migration: Lead capture (B4)
-- Captura de email simples na página pública. INSERT vai pelo Server Action
-- (Prisma role postgres bypassa RLS); leitura/exclusão só pelo dono.

-- ─── COLUNAS NA TABELA users ────────────────────────────────────────────────

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS leads_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS leads_heading TEXT,
  ADD COLUMN IF NOT EXISTS leads_button  TEXT;

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_leads_heading_len_check,
  DROP CONSTRAINT IF EXISTS users_leads_button_len_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_leads_heading_len_check
    CHECK (leads_heading IS NULL OR char_length(leads_heading) <= 80),
  ADD CONSTRAINT users_leads_button_len_check
    CHECK (leads_button IS NULL OR char_length(leads_button) <= 30);

COMMENT ON COLUMN public.users.leads_enabled IS 'Se TRUE, exibe formulário de captura na página pública';
COMMENT ON COLUMN public.users.leads_heading IS 'Título acima do formulário (NULL = default "Receba novidades")';
COMMENT ON COLUMN public.users.leads_button  IS 'Texto do botão (NULL = default "Inscrever-se")';

-- ─── TABELA leads ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.leads (
  id          UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID         NOT NULL,
  email       TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),

  CONSTRAINT leads_user_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT leads_email_format_check
    CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT leads_user_email_unique
    UNIQUE (user_id, email)
);

CREATE INDEX IF NOT EXISTS leads_user_created_idx
  ON public.leads (user_id, created_at DESC);

COMMENT ON TABLE  public.leads IS 'Leads capturados via formulário público da página de bio';
COMMENT ON COLUMN public.leads.email IS 'Email coletado — normalizado em lowercase pelo Server Action antes do insert';

-- ─── RLS ────────────────────────────────────────────────────────────────────

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- SELECT: só o dono. Importante para impedir que alguém com a anon key
-- enumere a base de emails de qualquer perfil.
CREATE POLICY "leads_select_self"
  ON public.leads FOR SELECT
  USING (auth.uid() = user_id);

-- DELETE: só o dono (LGPD — direito de apagamento individual de leads).
CREATE POLICY "leads_delete_self"
  ON public.leads FOR DELETE
  USING (auth.uid() = user_id);

-- INSERT: bloqueado para anon/authenticated. Vem pelo Server Action via
-- Prisma role postgres (bypassa RLS). Server Action valida slug → user_id,
-- aplica rate limit por IP e dedupe por (user_id, email).
-- (Sem policy de INSERT = negado por padrão.)
