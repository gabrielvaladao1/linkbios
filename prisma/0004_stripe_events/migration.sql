-- SmartBio — Migration 0004 — Idempotência de webhooks Stripe
--
-- Stripe retransmite eventos em caso de timeout (até 3 tentativas em 72h).
-- O handler insere event.id aqui no início; UNIQUE PK garante que reentregas
-- caem em violação e o handler aborta sem reprocessar.

CREATE TABLE "stripe_events" (
  "id"           TEXT PRIMARY KEY,
  "event_type"   TEXT        NOT NULL,
  "processed_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "stripe_events_processed_at_idx" ON "stripe_events" ("processed_at");

-- Sem policies = bloqueado para anon e authenticated. Apenas o backend
-- (Prisma com role postgres) e service_role escrevem.
ALTER TABLE "stripe_events" ENABLE ROW LEVEL SECURITY;
