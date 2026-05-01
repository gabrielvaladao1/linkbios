# ── Stage 1: Dependencies ──────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts
RUN npx prisma generate || true

# ── Stage 2: Build ─────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma generate
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# NEXT_PUBLIC_ vars must be present at build time (baked into client JS)
ENV NEXT_PUBLIC_APP_URL=https://paginabio.com.br
ENV NEXT_PUBLIC_SUPABASE_URL=https://qkqbpnlofywmlvkyhrzk.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrcWJwbmxvZnl3bWx2a3locnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNjgzODMsImV4cCI6MjA5Mjc0NDM4M30.DnmyHbIAo101F0ZRt7WAOw0LIku8OwvCdEDL2CWIkCI

# Dummy DB URL for build only (real one comes from runtime env)
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV DIRECT_URL=postgresql://dummy:dummy@localhost:5432/dummy

# Dummy keys for build only (real ones come from runtime env)
ENV STRIPE_SECRET_KEY=sk_test_dummy_build_only
ENV STRIPE_WEBHOOK_SECRET=whsec_dummy_build_only
ENV STRIPE_PRO_PRICE_ID=price_dummy
ENV STRIPE_BUSINESS_PRICE_ID=price_dummy
ENV STRIPE_PRO_YEARLY_PRICE_ID=price_dummy
ENV STRIPE_BUSINESS_YEARLY_PRICE_ID=price_dummy
ENV RESEND_API_KEY=re_dummy_build_only
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.dummy

RUN npm run build

# ── Stage 3: Production ────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Security: non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy Prisma engine (needed at runtime)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
