import Stripe from 'stripe'

// Usa string vazia se STRIPE_SECRET_KEY não estiver definida — assim o import
// nunca crasha. Tentativas de chamada à API falharão com erro de auth, que é
// capturado pelos try/catch nas server actions.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
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
      'PIX e Boleto',
      '2 páginas',
    ],
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
