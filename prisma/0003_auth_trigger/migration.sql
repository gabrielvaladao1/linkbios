-- SmartBio — Migration 0003 — Trigger de criação de profile no Supabase Auth
--
-- Quando um usuário é criado em auth.users (via Supabase Auth), inserimos
-- automaticamente o registro correspondente em public.users (profile).
--
-- O slug inicial é gerado a partir do email (parte antes do @), normalizado
-- para o formato esperado e com sufixo numérico se já existir.
-- O usuário pode alterar o slug depois pela tela de onboarding.

CREATE OR REPLACE FUNCTION public.generate_initial_slug(email_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  candidate_slug TEXT;
  counter INT := 0;
BEGIN
  -- normaliza: minúsculo, só [a-z0-9-], 3..30 chars
  base_slug := LOWER(SPLIT_PART(email_input, '@', 1));
  base_slug := REGEXP_REPLACE(base_slug, '[^a-z0-9-]', '-', 'g');
  base_slug := REGEXP_REPLACE(base_slug, '^-+|-+$', '', 'g');
  IF LENGTH(base_slug) < 3 THEN
    base_slug := base_slug || REPEAT('x', 3 - LENGTH(base_slug));
  END IF;
  IF LENGTH(base_slug) > 28 THEN
    base_slug := SUBSTRING(base_slug FROM 1 FOR 28);
  END IF;

  candidate_slug := base_slug;

  -- evita reservados e duplicatas
  WHILE EXISTS (SELECT 1 FROM public.users WHERE slug = candidate_slug)
     OR EXISTS (SELECT 1 FROM public.reserved_slugs WHERE slug = candidate_slug)
  LOOP
    counter := counter + 1;
    candidate_slug := base_slug || counter::TEXT;
  END LOOP;

  RETURN candidate_slug;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, slug)
  VALUES (
    NEW.id,
    NEW.email,
    public.generate_initial_slug(NEW.email)
  );
  RETURN NEW;
END;
$$;

-- O trigger fica em auth.users (schema do Supabase Auth).
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
