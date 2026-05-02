import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { NextRequest, NextResponse } from 'next/server'
import type { Plan } from '@prisma/client'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotência: PK em stripe_events.id. Se já processamos, retorna 200 sem
  // reprocessar. Stripe retransmite em caso de timeout.
  try {
    await prisma.stripeEvent.create({
      data: { id: event.id, eventType: event.type },
    })
  } catch (err) {
    // P2002 = unique constraint = duplicado. Outro erro = falha real.
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: string }).code === 'P2002'
    ) {
      return NextResponse.json({ received: true, duplicate: true })
    }
    console.error('Webhook idempotency check failed:', err)
    return NextResponse.json({ error: 'Idempotency failed' }, { status: 500 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as unknown as Record<string, unknown>
        const userId = (session.metadata as Record<string, string>)?.userId
        const planKey = (session.metadata as Record<string, string>)?.plan as Plan

        if (!userId || !planKey) break

        const subscriptionId = session.subscription as string
        const sub = await stripe.subscriptions.retrieve(subscriptionId) as unknown as {
          items: {
            data: Array<{
              price: { id: string }
              current_period_start: number
              current_period_end: number
            }>
          }
        }
        const item = sub.items.data[0]
        if (!item) break

        // Create subscription record
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: item.price.id,
            status: 'ACTIVE',
            currentPeriodStart: new Date(item.current_period_start * 1000),
            currentPeriodEnd: new Date(item.current_period_end * 1000),
          },
          update: {
            stripeSubscriptionId: subscriptionId,
            stripePriceId: item.price.id,
            status: 'ACTIVE',
            currentPeriodStart: new Date(item.current_period_start * 1000),
            currentPeriodEnd: new Date(item.current_period_end * 1000),
            cancelAtPeriodEnd: false,
          },
        })

        // Update user plan
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: planKey,
            hideBranding: planKey !== 'FREE',
          },
        })
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as unknown as {
          id: string
          status: string
          cancel_at_period_end: boolean
          items: {
            data: Array<{
              current_period_start: number
              current_period_end: number
            }>
          }
        }
        const subId = sub.id
        const subStatus = sub.status
        const cancelAtEnd = sub.cancel_at_period_end
        const item = sub.items?.data?.[0]

        // Lookup pelo subId em vez de exigir metadata.userId — subscriptions
        // criadas antes de propagarmos metadata pra subscription_data não têm
        // userId aqui, então buscamos a Subscription correspondente no banco.
        const existing = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subId },
        })
        if (!existing) break

        const status = subStatus === 'active'
          ? 'ACTIVE'
          : subStatus === 'past_due'
          ? 'PAST_DUE'
          : subStatus === 'canceled'
          ? 'CANCELED'
          : 'INCOMPLETE'

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subId },
          data: {
            status,
            // Se o item não veio com período (raro), preserva o anterior.
            ...(item && {
              currentPeriodStart: new Date(item.current_period_start * 1000),
              currentPeriodEnd: new Date(item.current_period_end * 1000),
            }),
            cancelAtPeriodEnd: cancelAtEnd,
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as unknown as Record<string, unknown>
        const subId = sub.id as string

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subId },
          data: { status: 'CANCELED' },
        })

        // Downgrade user to FREE
        const subscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subId },
        })
        if (subscription) {
          await prisma.user.update({
            where: { id: subscription.userId },
            data: { plan: 'FREE', hideBranding: false },
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as unknown as Record<string, unknown>
        const subId = invoice.subscription as string | null
        if (!subId) break
        await prisma.subscription.update({
          where: { stripeSubscriptionId: subId },
          data: { status: 'PAST_DUE' },
        })
        break
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
