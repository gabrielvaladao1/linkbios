-- SmartBio — Migration 0002 — Row Level Security (RLS)
--
-- Estratégia:
-- - O backend (Server Actions) acessa o banco via Prisma com a connection string
--   que usa o usuário "postgres" (bypass de RLS). Toda autorização é feita no código.
-- - RLS é defesa em profundidade para o caso de a anon key/JWT do Supabase ser
--   usada direto pelo client (ex.: Supabase Storage, Realtime, ou queries client-side
--   futuras).
-- - Páginas públicas (/[slug]) precisam ler `users` e `links` ANONIMAMENTE,
--   filtrados apenas pela coluna pública (slug) — por isso liberamos SELECT público
--   nessas tabelas, mas restritos.
-- - Eventos de tracking (page_views, link_clicks) podem ser INSERTed por anônimos,
--   mas só o dono pode ler.
-- - subscriptions é totalmente privada (só service_role escreve, dono lê).

-- ─── HABILITAR RLS ──────────────────────────────────────────────────────────

ALTER TABLE "users"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "links"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "page_views"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "link_clicks"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscriptions"  ENABLE ROW LEVEL SECURITY;

-- ─── USERS ──────────────────────────────────────────────────────────────────

-- Leitura pública: qualquer um pode ler perfis (necessário para /[slug]).
-- Atenção: isto expõe email. Se quiser ocultar email para anônimos,
-- crie uma view `public_profiles` que omite email/stripe_customer_id e
-- bloqueie SELECT em users para anon.
CREATE POLICY "users_select_public"
  ON "users" FOR SELECT
  USING (TRUE);

-- Update: só o próprio usuário autenticado.
CREATE POLICY "users_update_self"
  ON "users" FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert: criado pelo trigger handle_new_user (migration 0003) com SECURITY DEFINER.
-- Não criamos policy de INSERT para anon/authenticated — bloqueado por padrão.

-- Delete: só o dono.
CREATE POLICY "users_delete_self"
  ON "users" FOR DELETE
  USING (auth.uid() = id);

-- ─── LINKS ──────────────────────────────────────────────────────────────────

-- Leitura pública: qualquer um lê todos os links (necessário para /[slug]).
-- Não há informação sensível em links.
CREATE POLICY "links_select_public"
  ON "links" FOR SELECT
  USING (TRUE);

-- Insert/Update/Delete: só o dono.
CREATE POLICY "links_insert_self"
  ON "links" FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "links_update_self"
  ON "links" FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "links_delete_self"
  ON "links" FOR DELETE
  USING (auth.uid() = user_id);

-- ─── PAGE VIEWS ─────────────────────────────────────────────────────────────

-- Insert: anônimos podem inserir (tracking público).
CREATE POLICY "page_views_insert_anon"
  ON "page_views" FOR INSERT
  WITH CHECK (TRUE);

-- Select: só o dono pode ver suas estatísticas.
CREATE POLICY "page_views_select_self"
  ON "page_views" FOR SELECT
  USING (auth.uid() = user_id);

-- ─── LINK CLICKS ────────────────────────────────────────────────────────────

CREATE POLICY "link_clicks_insert_anon"
  ON "link_clicks" FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "link_clicks_select_self"
  ON "link_clicks" FOR SELECT
  USING (auth.uid() = user_id);

-- ─── SUBSCRIPTIONS ──────────────────────────────────────────────────────────

-- Select: só o dono.
CREATE POLICY "subscriptions_select_self"
  ON "subscriptions" FOR SELECT
  USING (auth.uid() = user_id);

-- Insert/Update/Delete: NUNCA por client. Só pela service_role (webhook do Stripe).
-- Sem policy = bloqueado para roles anon e authenticated.
