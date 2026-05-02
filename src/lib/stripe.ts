import Stripe from 'stripe'

// Lazy init via Proxy: só constrói o cliente Stripe quando alguém de fato
// usa uma propriedade (ex.: stripe.checkout). Assim o import deste módulo
// nunca crasha mesmo que STRIPE_SECRET_KEY não esteja definida — falha só
// no momento do uso, capturável pelos try/catch nas server actions.
let _stripe: Stripe | null = null
function getClient(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY não está configurada no servidor')
  }
  _stripe = new Stripe(key, {
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
  })
  return _stripe
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver)
  },
})

export type BillingInterval = 'monthly' | 'yearly'

export const PLANS = {
  FREE: {
    name: 'Grátis',
    price: { monthly: 0, yearly: 0 },
    priceId: { monthly: null, yearly: null },
    features: [
      'Links ilimitados',
      '3 templates',
      'Analytics 30 dias',
      'QR Code da página',
      'Social icons',
      'Marca PáginaBio',
    ],
    limits: {
      maxLinks: Infinity,
      analyticsRetentionDays: 30,
      maxTemplates: 3,
      hideBranding: false,
      customDomain: false,
      whatsappButton: false,
      pixelTracking: false,
      leadCapture: false,
      maxPages: 1,
    },
  },
  PRO: {
    name: 'Pro',
    price: { monthly: 14.9, yearly: 9.9 },
    priceId: {
      monthly: process.env.STRIPE_PRO_PRICE_ID ?? null,
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? null,
    },
    features: [
      'Links ilimitados',
      'Todos os 14+ templates',
      'Analytics completo',
      'Domínio custom',
      'Sem marca PáginaBio',
      'Botão WhatsApp',
      'Captura de emails',
      'Pixel Meta/TikTok',
      '2 páginas',
    ],
    // Features anunciadas mas ainda em construção — renderizadas com badge "em breve".
    comingSoon: ['Domínio custom', '2 páginas'] as readonly string[],
    limits: {
      maxLinks: Infinity,
      analyticsRetentionDays: 365,
      maxTemplates: Infinity,
      hideBranding: true,
      customDomain: true,
      whatsappButton: true,
      pixelTracking: true,
      leadCapture: true,
      maxPages: 2,
    },
  },
  BUSINESS: {
    name: 'Business',
    price: { monthly: 29.9, yearly: 19.9 },
    priceId: {
      monthly: process.env.STRIPE_BUSINESS_PRICE_ID ?? null,
      yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID ?? null,
    },
    features: [
      'Tudo do Pro',
      'Mini-loja com PIX (0% comissão)',
      'Até 10 páginas',
      'SEO avançado',
      'Relatório PDF',
      'Suporte prioritário',
    ],
    comingSoon: [
      'Mini-loja com PIX (0% comissão)',
      'Até 10 páginas',
      'SEO avançado',
      'Relatório PDF',
      'Suporte prioritário',
    ] as readonly string[],
    limits: {
      maxLinks: Infinity,
      analyticsRetentionDays: 365,
      maxTemplates: Infinity,
      hideBranding: true,
      customDomain: true,
      whatsappButton: true,
      pixelTracking: true,
      leadCapture: true,
      maxPages: 10,
    },
  },
} as const

export type PlanType = keyof typeof PLANS
