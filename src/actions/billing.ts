'use server'

import { prisma } from '@/lib/prisma'
import { stripe, PLANS, type BillingInterval } from '@/lib/stripe'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import type { Plan } from '@prisma/client'

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

    const metadata = { userId: user.id, plan: planKey, interval }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/planos?canceled=1`,
      metadata,
      // Espelha metadata na subscription pra eventos futuros (updated/deleted)
      subscription_data: { metadata },
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

type SyncResult =
  | { ok: true; plan: 'PRO' | 'BUSINESS'; interval: BillingInterval }
  | { ok: false; error: string }

// Sincroniza o estado de assinatura a partir de uma checkout session do Stripe.
// Idempotente: pode rodar antes ou depois do webhook sem efeito colateral.
// É a fonte de verdade para o retorno do checkout (success_url) — se o webhook
// atrasar ou falhar, o plano ainda é refletido no banco no instante do retorno.
export async function syncCheckoutSession(sessionId: string): Promise<SyncResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Não autenticado' }

  if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    return { ok: false, error: 'session_id inválido' }
  }

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'erro desconhecido'
    return { ok: false, error: `Não foi possível recuperar a sessão: ${msg}` }
  }

  const metadata = (session.metadata ?? {}) as Record<string, string>

  // Defesa: a session só pode atualizar o plano do dono dela.
  if (metadata.userId !== user.id) {
    return { ok: false, error: 'Sessão não pertence a este usuário' }
  }

  const planKey = metadata.plan
  if (planKey !== 'PRO' && planKey !== 'BUSINESS') {
    return { ok: false, error: 'Plano inválido na sessão' }
  }
  const interval = (metadata.interval === 'yearly' ? 'yearly' : 'monthly') as BillingInterval

  if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
    return { ok: false, error: `Pagamento ainda não confirmado (status: ${session.payment_status})` }
  }

  const subscription = session.subscription
  if (!subscription || typeof subscription === 'string') {
    return { ok: false, error: 'Sessão sem assinatura expandida' }
  }

  const sub = subscription as unknown as {
    id: string
    items: { data: Array<{ price: { id: string } }> }
    current_period_start: number
    current_period_end: number
  }

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      stripeSubscriptionId: sub.id,
      stripePriceId: sub.items.data[0].price.id,
      status: 'ACTIVE',
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
    },
    update: {
      stripeSubscriptionId: sub.id,
      stripePriceId: sub.items.data[0].price.id,
      status: 'ACTIVE',
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: false,
    },
  })

  await prisma.user.update({
    where: { id: user.id },
    data: { plan: planKey as Plan, hideBranding: true },
  })

  return { ok: true, plan: planKey, interval }
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
