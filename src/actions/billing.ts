'use server'

import { prisma } from '@/lib/prisma'
import { stripe, PLANS, type BillingInterval } from '@/lib/stripe'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'

export async function createCheckoutSession(planKey: 'PRO' | 'BUSINESS', interval: BillingInterval = 'monthly') {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const plan = PLANS[planKey]
  const priceId = plan.priceId[interval]
  if (!priceId) return { error: 'Plano inválido ou preço não configurado' }

  // Get or create Stripe customer
  let customerId = user.stripeId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id, slug: user.slug },
    })
    customerId = customer.id
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeId: customerId },
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card', 'boleto', 'pix'],
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    payment_method_options: {
      pix: {
        expires_after_seconds: 3600, // 1 hora para pagar
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/planos`,
    metadata: { userId: user.id, plan: planKey, interval },
  })

  if (session.url) {
    redirect(session.url)
  }

  return { error: 'Erro ao criar sessão de checkout' }
}

export async function cancelSubscription() {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  })

  if (!subscription) return { error: 'Nenhuma assinatura ativa' }

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  })

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { cancelAtPeriodEnd: true },
  })

  return { success: 'Assinatura será cancelada no final do período' }
}

export async function getSubscription() {
  const user = await getCurrentUser()
  if (!user) return null

  return prisma.subscription.findUnique({
    where: { userId: user.id },
  })
}
