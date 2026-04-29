// Rate limiter in-memory simples — janela deslizante por chave.
// Limitação: cada serverless instance tem seu próprio Map. Em produção
// multi-instância (Vercel), trocar por Upstash Redis ou Vercel KV.
// Aceitável como mitigação inicial pré-lançamento.

type Bucket = { count: number; resetAt: number }

const store = new Map<string, Bucket>()

export interface RateLimitResult {
  ok: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const bucket = store.get(key)

  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { ok: true, remaining: limit - 1, resetAt }
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt }
  }

  bucket.count += 1
  return { ok: true, remaining: limit - bucket.count, resetAt: bucket.resetAt }
}

// GC ocasional para não vazar memória em runtime longo.
let lastGc = Date.now()
export function maybeGc() {
  const now = Date.now()
  if (now - lastGc < 60_000) return
  lastGc = now
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key)
  }
}
