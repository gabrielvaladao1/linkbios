-- SmartBio — Migration 0001 — schema inicial
-- Roda em ordem antes das migrations 0002 (RLS) e 0003 (auth trigger).

-- ─── ENUMS ──────────────────────────────────────────────────────────────────

CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'BUSINESS');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'INCOMPLETE');

-- ─── USERS ──────────────────────────────────────────────────────────────────

CREATE TABLE "users" (
  "id"                  UUID         PRIMARY KEY,
  "email"               TEXT         NOT NULL UNIQUE,
  "slug"                TEXT         NOT NULL UNIQUE,
  "name"                TEXT,
  "bio"                 TEXT,
  "avatar_url"          TEXT,
  "whatsapp"            TEXT,
  "plan"                "Plan"       NOT NULL DEFAULT 'FREE',
  "stripe_customer_id"  TEXT         UNIQUE,
  "template_id"         TEXT         NOT NULL DEFAULT 'minimal',
  "color_bg"            TEXT         NOT NULL DEFAULT '#ffffff',
  "color_button"        TEXT         NOT NULL DEFAULT '#000000',
  "color_text"          TEXT         NOT NULL DEFAULT '#ffffff',
  "font_family"         TEXT         NOT NULL DEFAULT 'Inter',
  "hide_branding"       BOOLEAN      NOT NULL DEFAULT FALSE,
  "created_at"          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updated_at"          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  -- garantias de qualidade do slug
  CONSTRAINT users_slug_format_chk CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,29}$'),
  CONSTRAINT users_slug_lowercase_chk CHECK (slug = LOWER(slug))
);

-- slugs reservados (não podem ser registrados)
CREATE TABLE "reserved_slugs" (
  "slug" TEXT PRIMARY KEY
);
INSERT INTO "reserved_slugs" ("slug") VALUES
  ('admin'), ('api'), ('app'), ('auth'), ('blog'), ('dashboard'),
  ('docs'), ('help'), ('login'), ('logout'), ('signup'), ('signin'),
  ('settings'), ('billing'), ('pricing'), ('precos'), ('terms'),
  ('privacy'), ('about'), ('sobre'), ('contact'), ('contato'),
  ('smartbio'), ('www'), ('mail'), ('email'), ('webhook'),
  ('webhooks'), ('static'), ('public'), ('assets'), ('cdn');

-- ─── LINKS ──────────────────────────────────────────────────────────────────

CREATE TABLE "links" (
  "id"          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"     UUID         NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title"       TEXT         NOT NULL,
  "url"         TEXT         NOT NULL,
  "icon"        TEXT,
  "position"    INTEGER      NOT NULL DEFAULT 0,
  "is_active"   BOOLEAN      NOT NULL DEFAULT TRUE,
  "created_at"  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updated_at"  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX "links_user_id_position_idx" ON "links" ("user_id", "position");

-- ─── PAGE VIEWS ─────────────────────────────────────────────────────────────

CREATE TABLE "page_views" (
  "id"         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"    UUID         NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "referrer"   TEXT,
  "user_agent" TEXT,
  "country"    TEXT,
  "ip_hash"    TEXT,
  "created_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX "page_views_user_id_created_at_idx" ON "page_views" ("user_id", "created_at");
-- evita inflar pageview do mesmo IP no mesmo dia (UTC)
-- DATE_TRUNC sobre TIMESTAMPTZ não é IMMUTABLE (depende do fuso da sessão).
-- Convertendo p/ UTC primeiro o resultado vira IMMUTABLE e pode ir em índice.
CREATE UNIQUE INDEX "page_views_dedup_per_day_idx"
  ON "page_views" ("user_id", "ip_hash", (DATE_TRUNC('day', "created_at" AT TIME ZONE 'UTC')))
  WHERE "ip_hash" IS NOT NULL;

-- ─── LINK CLICKS ────────────────────────────────────────────────────────────

CREATE TABLE "link_clicks" (
  "id"         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  "link_id"    UUID         NOT NULL REFERENCES "links"("id") ON DELETE CASCADE,
  "user_id"    UUID         NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX "link_clicks_link_id_created_at_idx" ON "link_clicks" ("link_id", "created_at");
CREATE INDEX "link_clicks_user_id_created_at_idx" ON "link_clicks" ("user_id", "created_at");

-- ─── SUBSCRIPTIONS ──────────────────────────────────────────────────────────

CREATE TABLE "subscriptions" (
  "id"                       UUID                  PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"                  UUID                  NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "stripe_subscription_id"   TEXT                  NOT NULL UNIQUE,
  "stripe_price_id"          TEXT                  NOT NULL,
  "status"                   "SubscriptionStatus"  NOT NULL DEFAULT 'ACTIVE',
  "current_period_start"     TIMESTAMPTZ           NOT NULL,
  "current_period_end"       TIMESTAMPTZ           NOT NULL,
  "cancel_at_period_end"     BOOLEAN               NOT NULL DEFAULT FALSE,
  "created_at"               TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
  "updated_at"               TIMESTAMPTZ           NOT NULL DEFAULT NOW()
);

-- ─── TRIGGERS DE UPDATED_AT ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users      BEFORE UPDATE ON "users"         FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_links      BEFORE UPDATE ON "links"         FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_subs       BEFORE UPDATE ON "subscriptions" FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
