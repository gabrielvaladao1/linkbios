import { syncCheckoutSession } from '@/actions/billing'
import { PLANS } from '@/lib/stripe'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const PLAN_BENEFITS: Record<'PRO' | 'BUSINESS', { intro: string; benefits: { icon: string; title: string; desc: string }[] }> = {
  PRO: {
    intro: 'Você desbloqueou tudo que o Pro tem a oferecer. É hora de turbinar sua presença online.',
    benefits: [
      { icon: '🎨', title: 'Todos os 14+ templates', desc: 'Acesse o catálogo completo, incluindo Hero e templates premium.' },
      { icon: '📊', title: 'Analytics completo', desc: 'Histórico ilimitado, dispositivos, países, navegadores e referrers.' },
      { icon: '🌐', title: 'Domínio próprio', desc: 'Conecte seudominio.com.br à sua página.' },
      { icon: '✨', title: 'Sem marca PáginaBio', desc: 'Sua página, sua marca. Branding 100% seu.' },
      { icon: '💚', title: 'Botão WhatsApp', desc: 'CTA direto pro WhatsApp em destaque na sua página.' },
      { icon: '📧', title: 'Captura de emails', desc: 'Cresça sua lista coletando leads direto da página.' },
      { icon: '🎯', title: 'Pixel Meta/TikTok', desc: 'Faça remarketing e otimize anúncios com tracking nativo.' },
      { icon: '📄', title: '2 páginas', desc: 'Crie uma segunda página pra projetos paralelos.' },
    ],
  },
  BUSINESS: {
    intro: 'Você está no plano mais completo. Bora vender e escalar.',
    benefits: [
      { icon: '🛒', title: 'Mini-loja com PIX', desc: 'Receba pagamentos com 0% de comissão direto na sua página.' },
      { icon: '📚', title: 'Até 10 páginas', desc: 'Uma página por projeto, campanha ou produto.' },
      { icon: '🔍', title: 'SEO avançado', desc: 'Schema.org, sitemap, meta tags otimizadas e canonical.' },
      { icon: '📈', title: 'Relatório PDF', desc: 'Exporte um relatório mensal completo da sua performance.' },
      { icon: '⚡', title: 'Suporte prioritário', desc: 'Resposta em até 24h em dias úteis.' },
      { icon: '✨', title: 'Tudo do Pro incluso', desc: 'Templates, analytics, captura, pixel, domínio próprio e mais.' },
    ],
  },
}

export default async function UpgradeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id

  if (!sessionId) redirect('/dashboard/planos')

  const result = await syncCheckoutSession(sessionId)

  if (!result.ok) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto py-12">
        <div className="p-8 rounded-3xl border border-yellow-500/30 bg-yellow-500/5 space-y-4 text-center">
          <div className="text-5xl">⏳</div>
          <h1 className="text-2xl font-bold text-yellow-200">Processando seu pagamento</h1>
          <p className="text-zinc-400 text-sm">
            O Stripe ainda está confirmando a transação. Isso costuma levar poucos segundos. Tente
            recarregar daqui a pouco — assim que o pagamento for liberado, seu plano é atualizado
            automaticamente.
          </p>
          <div className="p-3 rounded-xl bg-black/30 border border-yellow-500/20">
            <p className="text-xs text-zinc-500 font-medium mb-1">Detalhe técnico:</p>
            <pre className="text-xs text-yellow-200 whitespace-pre-wrap break-words">
              {result.error}
            </pre>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href={`/dashboard/upgrade-success?session_id=${encodeURIComponent(sessionId)}`}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all"
            >
              Tentar novamente
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl border border-surface-border hover:border-zinc-600 text-zinc-300 text-sm font-medium transition-all"
            >
              Ir para o dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const planMeta = PLANS[result.plan]
  const content = PLAN_BENEFITS[result.plan]
  const yearlyLabel = result.interval === 'yearly' ? 'anual' : 'mensal'

  return (
    <div className="animate-fade-in max-w-3xl mx-auto py-8 space-y-8">
      {/* Header de celebração */}
      <div className="relative overflow-hidden p-8 md:p-10 rounded-3xl border border-brand-600/30 bg-gradient-to-br from-brand-600/15 via-brand-600/5 to-transparent text-center">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_60%)]" />
        <div className="relative space-y-4">
          <div className="text-6xl md:text-7xl">🎉</div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Parabéns! Você agora é{' '}
            <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              {planMeta.name}
            </span>
          </h1>
          <p className="text-zinc-300 text-base md:text-lg max-w-xl mx-auto">{content.intro}</p>
          <p className="text-xs text-zinc-500 pt-1">
            Plano <span className="text-zinc-300 font-medium">{planMeta.name} {yearlyLabel}</span>
            {' · '}assinatura ativa{' · '}o recibo chega no seu email em instantes.
          </p>
        </div>
      </div>

      {/* Grid de benefícios */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-zinc-200">O que você acabou de desbloquear</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {content.benefits.map((b, i) => (
            <div
              key={i}
              className="flex gap-3 p-4 rounded-2xl border border-surface-border bg-surface-card hover:border-brand-600/40 transition-all"
            >
              <div className="text-2xl shrink-0 leading-none mt-0.5">{b.icon}</div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-zinc-100">{b.title}</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs próximos passos */}
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card space-y-4">
        <h2 className="font-semibold text-zinc-200">Próximos passos</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/dashboard/aparencia"
            className="group p-4 rounded-xl border border-surface-border hover:border-brand-600/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm group-hover:text-brand-400 transition-colors">
                  Explorar templates premium
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">Agora você tem acesso a todos.</p>
              </div>
              <span className="text-xl">🎨</span>
            </div>
          </Link>
          <Link
            href="/dashboard/configuracoes"
            className="group p-4 rounded-xl border border-surface-border hover:border-brand-600/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm group-hover:text-brand-400 transition-colors">
                  Configurar pixel e domínio
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">Tracking e branding 100% seu.</p>
              </div>
              <span className="text-xl">⚙️</span>
            </div>
          </Link>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium text-center transition-all"
          >
            Ir para o dashboard
          </Link>
          <Link
            href="/dashboard/planos"
            className="flex-1 py-3 rounded-xl border border-surface-border hover:border-zinc-600 text-zinc-300 text-sm font-medium text-center transition-all"
          >
            Gerenciar assinatura
          </Link>
        </div>
      </div>
    </div>
  )
}
