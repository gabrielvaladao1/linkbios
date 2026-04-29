import type { NextConfig } from 'next'

const securityHeaders = [
  // HSTS — força HTTPS por 2 anos. Só ativa em produção (em localhost o navegador
  // ignora, mas evita header desnecessário em dev preview).
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Bloqueia clickjacking. Páginas públicas /[slug] não precisam ser embedadas.
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // Bloqueia MIME sniffing.
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Vaza o mínimo possível em referrer cross-origin.
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Desliga APIs sensíveis que o produto não usa.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Cross-Origin Opener Policy — isola contexto do browser.
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        // Webhook do Stripe não deve ter X-Frame-Options e nem precisa dos demais.
        // O matcher abaixo aplica para tudo exceto o webhook.
        source: '/((?!api/webhooks).*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
