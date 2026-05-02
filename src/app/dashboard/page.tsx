import { getCurrentUser } from '@/actions/auth'
import { getAnalyticsSummary } from '@/actions/analytics'
import { formatNumber } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ShareButton from '@/components/dashboard/share-button'
import SetupChecklist from '@/components/dashboard/setup-checklist'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const analytics = await getAnalyticsSummary()

  if (!user) return null

  const linkCount = await prisma.link.count({ where: { userId: user.id } })
  const socialLinks = (user.socialLinks as { platform: string; url: string }[]) || []

  const stats = [
    { label: 'Visitas hoje', value: formatNumber(analytics?.viewsToday ?? 0), icon: '👁️' },
    { label: 'Últimos 7 dias', value: formatNumber(analytics?.views7d ?? 0), icon: '📊' },
    { label: 'Total de cliques', value: formatNumber(analytics?.totalClicks ?? 0), icon: '🖱️' },
    { label: 'CTR', value: `${analytics?.ctr ?? 0}%`, icon: '📈' },
  ]

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Olá, {user.name || user.slug}! 👋
          </h1>
          <p className="text-zinc-400 mt-1">
            Sua página: <a href={`/${user.slug}`} target="_blank" className="text-brand-400 hover:underline">
              paginabio.com.br/{user.slug} ↗
            </a>
          </p>
        </div>
        <ShareButton slug={user.slug} />
      </div>

      <SetupChecklist
        hasLinks={linkCount > 0}
        hasAvatar={!!user.avatarUrl}
        hasCustomTemplate={user.templateId !== 'minimal'}
        hasSocialLinks={socialLinks.length > 0}
        hasShared={(analytics?.viewsToday ?? 0) > 0}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl border border-surface-border bg-surface-card hover:border-brand-600/30 transition-colors">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/dashboard/links" className="group p-6 rounded-2xl border border-surface-border bg-surface-card hover:border-brand-600/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold group-hover:text-brand-400 transition-colors">Gerenciar links</h3>
              <p className="text-sm text-zinc-500 mt-1">Adicione, edite e reordene seus links</p>
            </div>
            <span className="text-2xl">🔗</span>
          </div>
        </Link>
        <Link href="/dashboard/aparencia" className="group p-6 rounded-2xl border border-surface-border bg-surface-card hover:border-brand-600/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold group-hover:text-brand-400 transition-colors">Personalizar aparência</h3>
              <p className="text-sm text-zinc-500 mt-1">Escolha template, cores e foto</p>
            </div>
            <span className="text-2xl">🎨</span>
          </div>
        </Link>
      </div>

      {analytics && analytics.clickRanking.length > 0 && (
        <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
          <h3 className="font-semibold mb-4">Links mais clicados</h3>
          <div className="space-y-3">
            {analytics.clickRanking.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm text-zinc-500 w-5 shrink-0">#{i + 1}</span>
                  <span className="text-sm truncate">{item.title}</span>
                </div>
                <span className="text-sm font-medium text-brand-400 shrink-0">{item.clicks} cliques</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
