import { getAnalyticsSummary, getViewsByDay, getAnalyticsBreakdowns } from '@/actions/analytics'
import { formatNumber } from '@/lib/utils'
import ExportAnalyticsButton from '@/components/dashboard/export-analytics-button'

/* ─── Reusable Breakdown Card ────────────────────────────────── */

function BreakdownCard({
  title,
  icon,
  items,
  total,
  colorClass = 'bg-brand-600',
}: {
  title: string
  icon: string
  items: { name: string; count: number }[]
  total: number
  colorClass?: string
}) {
  if (items.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
        <h3 className="font-semibold mb-4">{icon} {title}</h3>
        <p className="text-sm text-zinc-500 py-4 text-center">Sem dados ainda</p>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
      <h3 className="font-semibold mb-4">{icon} {title}</h3>
      <div className="space-y-3">
        {items.map((item, i) => {
          const pct = total > 0 ? (item.count / total) * 100 : 0
          return (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm truncate pr-4">{item.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-zinc-500">{pct.toFixed(0)}%</span>
                  <span className="text-sm font-medium text-brand-400 w-8 text-right">{item.count}</span>
                </div>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                  style={{ width: `${Math.max(pct, 1)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────── */

export default async function AnalyticsPage() {
  const [summary, viewsByDay, breakdowns] = await Promise.all([
    getAnalyticsSummary(),
    getViewsByDay(30),
    getAnalyticsBreakdowns(30),
  ])

  if (!summary) return null

  const maxViews = Math.max(...viewsByDay.map(d => d.views), 1)

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-zinc-400 text-sm mt-1">Acompanhe o desempenho da sua página</p>
        </div>
        <ExportAnalyticsButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Hoje', value: summary.viewsToday, icon: '👁️' },
          { label: '7 dias', value: summary.views7d, icon: '📊' },
          { label: '30 dias', value: summary.views30d, icon: '📈' },
          { label: 'Total visitas', value: summary.totalViews, icon: '🏆' },
          { label: 'CTR', value: summary.ctr + '%', icon: '🎯', isText: true },
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl border border-surface-border bg-surface-card">
            <p className="text-xs text-zinc-500 mb-1">{stat.icon} {stat.label}</p>
            <p className="text-2xl font-bold">
              {'isText' in stat ? stat.value : formatNumber(stat.value as number)}
            </p>
          </div>
        ))}
      </div>

      {/* Chart - Views over time */}
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
        <h3 className="font-semibold mb-6">Visitas — últimos 30 dias</h3>
        <div className="flex items-end gap-[2px] h-40">
          {viewsByDay.map((day, i) => (
            <div
              key={i}
              className="flex-1 group relative"
            >
              <div
                className="w-full bg-brand-600/60 hover:bg-brand-500 rounded-t transition-colors cursor-pointer"
                style={{ height: `${Math.max((day.views / maxViews) * 100, 2)}%` }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-zinc-800 border border-surface-border rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap shadow-lg">
                    <p className="font-medium">{day.views} visitas</p>
                    <p className="text-zinc-500">{new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-600">
          <span>{viewsByDay[0]?.date ? new Date(viewsByDay[0].date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : ''}</span>
          <span>Hoje</span>
        </div>
      </div>

      {/* Breakdowns Grid */}
      {breakdowns && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Referrer Sources */}
          <BreakdownCard
            title="Origens do tráfego"
            icon="🔗"
            items={breakdowns.referrers.map(r => ({ name: r.source, count: r.count }))}
            total={breakdowns.totalViews}
            colorClass="bg-gradient-to-r from-blue-500 to-cyan-500"
          />

          {/* Countries */}
          <BreakdownCard
            title="Países"
            icon="🌍"
            items={breakdowns.countries}
            total={breakdowns.totalViews}
            colorClass="bg-gradient-to-r from-green-500 to-emerald-500"
          />

          {/* Devices */}
          <BreakdownCard
            title="Dispositivos"
            icon="📱"
            items={breakdowns.devices}
            total={breakdowns.totalViews}
            colorClass="bg-gradient-to-r from-purple-500 to-violet-500"
          />

          {/* Browsers */}
          <BreakdownCard
            title="Navegadores"
            icon="🌐"
            items={breakdowns.browsers}
            total={breakdowns.totalViews}
            colorClass="bg-gradient-to-r from-orange-500 to-amber-500"
          />
        </div>
      )}

      {/* Click Ranking */}
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
        <h3 className="font-semibold mb-4">🖱️ Links mais clicados</h3>
        {summary.clickRanking.length > 0 ? (
          <div className="space-y-3">
            {summary.clickRanking.map((item, i) => {
              const percentage = summary.totalClicks > 0 ? (item.clicks / summary.totalClicks) * 100 : 0
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-zinc-600 w-5 shrink-0">#{i + 1}</span>
                      <span className="text-sm truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-zinc-500">{percentage.toFixed(0)}%</span>
                      <span className="text-sm font-medium text-brand-400">{item.clicks}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 py-4 text-center">Nenhum clique registrado ainda</p>
        )}
      </div>
    </div>
  )
}
