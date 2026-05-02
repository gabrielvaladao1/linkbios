export const PLAN_LIMITS = {
  FREE: {
    maxLinks: 5,
    analyticsRetentionDays: 7,
    hideBranding: false,
    customDomain: false,
    whatsappButton: false,
  },
  PRO: {
    maxLinks: Infinity,
    analyticsRetentionDays: 365,
    hideBranding: true,
    customDomain: true,
    whatsappButton: true,
  },
  BUSINESS: {
    maxLinks: Infinity,
    analyticsRetentionDays: 365,
    hideBranding: true,
    customDomain: true,
    whatsappButton: true,
  },
} as const

export const APP_NAME = 'PáginaBio'
export const APP_DESCRIPTION = 'Sua página de links profissional com PIX, analytics e WhatsApp. 100% brasileira.'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://paginabio.com.br'

export const RESERVED_SLUGS = [
  'admin', 'api', 'app', 'auth', 'blog', 'dashboard',
  'docs', 'help', 'login', 'logout', 'signup', 'signin',
  'settings', 'billing', 'pricing', 'precos', 'terms',
  'privacy', 'about', 'sobre', 'contact', 'contato',
  'PáginaBio', 'www', 'mail', 'email', 'webhook',
]
