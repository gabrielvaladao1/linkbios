'use client'

import { useState, useTransition } from 'react'
import { createCheckoutSession } from '@/actions/billing'
import { PLANS, type BillingInterval } from '@/lib/stripe'

interface PlansPageClientProps {
  currentPlan: string
  hasSubscription: boolean
  cancelAtPeriodEnd: boolean
}

const PLAN_KEYS = ['FREE', 'PRO', 'BUSINESS'] as const

function formatPrice(value: number): string {
  if (value === 0) return 'R$0'
  return `R$${value.toFixed(2).replace('.', ',')}`
}

export default function PlansPageClient({
  currentPlan,
  hasSubscription,
  cancelAtPeriodEnd,
}: PlansPageClientProps) {
  const [interval, setInterval] = useState<BillingInterval>('monthly')
  const [isPending, startTransition] = useTransition()

  function handleSubscribe(planKey: 'PRO' | 'BUSINESS') {
    startTransition(async () => {
      await createCheckoutSession(planKey, interval)
    })
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Planos</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Seu plano atual: <span className="font-medium text-brand-400">{currentPlan === 'FREE' ? 'Grátis' : currentPlan}</span>
          {cancelAtPeriodEnd && <span className="text-yellow-400 ml-2">(cancela no fim do período)</span>}
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setInterval('monthly')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            interval === 'monthly'
              ? 'bg-brand-600 text-white'
              : 'bg-surface-card border border-surface-border text-zinc-400 hover:text-white'
          }`}
        >
          Mensal
        </button>
        <button
          onClick={() => setInterval('yearly')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${
            interval === 'yearly'
              ? 'bg-brand-600 text-white'
              : 'bg-surface-card border border-surface-border text-zinc-400 hover:text-white'
          }`}
        >
          Anual
          <span className="absolute -top-2.5 -right-2 px-1.5 py-0.5 rounded-full bg-green-500 text-[9px] font-bold text-white">
            -33%
          </span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLAN_KEYS.map((key) => {
          const plan = PLANS[key]
          const isCurrent = currentPlan === key
          const isPopular = key === 'PRO'
          const price = plan.price[interval]
          const monthlyPrice = plan.price.monthly
          const showSavings = interval === 'yearly' && monthlyPrice > 0

          return (
            <div
              key={key}
              className={`relative p-6 rounded-2xl border bg-surface-card transition-all ${
                isPopular ? 'border-2 border-brand-600 shadow-xl shadow-brand-600/10' : 'border-surface-border'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-600 rounded-full text-xs font-bold">
                  MAIS POPULAR
                </div>
              )}

              <h3 className="font-semibold text-lg">{plan.name}</h3>

              <div className="mt-2 mb-1">
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">{formatPrice(price)}</span>
                  <span className="text-zinc-500 mb-0.5">/mês</span>
                </div>
                {showSavings && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500 line-through">
                      {formatPrice(monthlyPrice)}/mês
                    </span>
                    <span className="text-xs text-green-400 font-medium">
                      Economia de R${((monthlyPrice - price) * 12).toFixed(0)}/ano
                    </span>
                  </div>
                )}
                {interval === 'yearly' && price > 0 && (
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Cobrado R${(price * 12).toFixed(2).replace('.', ',')}/ano
                  </p>
                )}
              </div>

              <ul className="space-y-2 mt-4 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-brand-400">✓</span> {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-2.5 rounded-xl border border-brand-600/30 text-brand-400 text-center text-sm font-medium">
                  Plano atual
                </div>
              ) : key === 'FREE' ? (
                <div className="w-full py-2.5 rounded-xl border border-surface-border text-zinc-500 text-center text-sm">
                  Plano base
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(key)}
                  disabled={isPending}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
                    isPopular
                      ? 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-lg hover:shadow-brand-600/25'
                      : 'border border-surface-border hover:border-zinc-600 text-zinc-300'
                  }`}
                >
                  {isPending ? 'Redirecionando...' : `Assinar ${plan.name}`}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
