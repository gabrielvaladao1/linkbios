-- SmartBio — Migration 0005 — View pública de perfis e fechamento do SELECT em users
--
-- Problema corrigido: a policy `users_select_public` da migration 0002 permitia
-- qualquer cliente anon (com a anon key embarcada no bundle do browser) ler
-- TODOS os campos da tabela `users`, incluindo `email` e `stripe_customer_id`.
--
-- Solução:
-- 1. Criar a view `public_profiles` com apenas as colunas que devem ser
--    expostas publicamente.
-- 2. Trocar a policy de SELECT em `users` para permitir só o próprio dono.
-- 3. Conceder SELECT na view para anon e authenticated.
--
-- A app (Prisma com role postgres) continua lendo `users` direto — RLS é
-- bypassed para esse role. A view só importa para clientes supabase-js que
-- usem a anon key.

-- ─── VIEW ──────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = false) AS
SELECT
  id,
  slug,
  name,
  bio,
  avatar_url,
  whatsapp,
  plan,
  template_id,
  color_bg,
  color_button,
  color_text,
  font_family,
  hide_branding,
  created_at
FROM public.users;

COMMENT ON VIEW public.public_profiles IS
  'Projeção pública de users — sem email e sem stripe_customer_id. SECURITY DEFINER intencional para que a anon key possa ler perfis públicos sem destravar a tabela base.';

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- ─── POLICIES DE USERS ─────────────────────────────────────────────────────

-- Substituir SELECT total por SELECT apenas do próprio dono.
DROP POLICY IF EXISTS "users_select_public" ON public.users;

CREATE POLICY "users_select_self"
  ON public.users FOR SELECT
  USING (auth.uid() = id);
