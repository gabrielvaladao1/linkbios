import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
})

export type BillingInterval = 'monthly' | 'yearly'

export const PLANS = {
  FREE: {
    name: 'GrÃ¡tis',
    price: { monthly: 0, yearly: 0 },
    priceId: { monthly: null, yearly: null },
    features: [
      'Links ilimitados',
      '3 templates',
      'Analytics 30 dias',
      'QR Code da pÃ¡gina',
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
      'DomÃ­nio custom',
      'Sem marca PáginaBio',
      'BotÃ£o WhatsApp',
      'Captura de emails',
      'Pixel Meta/TikTok',
      'PIX e Boleto',
      '2 pÃ¡ginas',
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
      'Mini-loja com PIX (0% comissÃ£o)',
      'AtÃ© 10 pÃ¡ginas',
      'SEO avanÃ§ado',
      'RelatÃ³rio PDF',
      'Suporte prioritÃ¡rio',
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
