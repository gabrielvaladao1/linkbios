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
  if (!priceId) return { error: `Plano ${planKey} ${interval} não configurado (price ID ausente nas envs)` }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: 'STRIPE_SECRET_KEY não está configurada no servidor' }
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    return { error: 'NEXT_PUBLIC_APP_URL não está configurada no servidor' }
  }

  let sessionUrl: string | null = null
  try {
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
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/planos`,
      metadata: { userId: user.id, plan: planKey, interval },
    })
    sessionUrl = session.url
  } catch (err) {
    console.error('[billing.createCheckoutSession]', err)
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return { error: `Stripe: ${message}` }
  }

  if (!sessionUrl) {
    return { error: 'Stripe não retornou URL da sessão' }
  }

  redirect(sessionUrl)
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
