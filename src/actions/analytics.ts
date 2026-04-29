'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'

export async function getAnalyticsSummary() {
  const user = await getCurrentUser()
  if (!user) return null

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [totalViews, viewsToday, views7d, views30d, totalClicks, clicksByLink] =
    await Promise.all([
      // Total views (all time)
      prisma.pageView.count({ where: { userId: user.id } }),

      // Views today
      prisma.pageView.count({
        where: { userId: user.id, createdAt: { gte: today } },
      }),

      // Views last 7 days
      prisma.pageView.count({
        where: { userId: user.id, createdAt: { gte: sevenDaysAgo } },
      }),

      // Views last 30 days
      prisma.pageView.count({
        where: { userId: user.id, createdAt: { gte: thirtyDaysAgo } },
      }),

      // Total clicks (all time)
      prisma.linkClick.count({ where: { userId: user.id } }),

      // Clicks by link (for ranking)
      prisma.linkClick.groupBy({
        by: ['linkId'],
        where: { userId: user.id },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 20,
      }),
    ])

  // Get link details for click ranking
  const linkIds = clicksByLink.map(c => c.linkId)
  const links = await prisma.link.findMany({
    where: { id: { in: linkIds } },
    select: { id: true, title: true, url: true },
  })

  const clickRanking = clicksByLink.map(c => {
    const link = links.find(l => l.id === c.linkId)
    return {
      linkId: c.linkId,
      title: link?.title ?? 'Link removido',
      url: link?.url ?? '',
      clicks: c._count.id,
    }
  })

  return {
    totalViews,
    viewsToday,
    views7d,
    views30d,
    totalClicks,
    clickRanking,
    ctr: totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0',
  }
}

export async function getViewsByDay(days: number = 7) {
  const user = await getCurrentUser()
  if (!user) return []

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const views = await prisma.pageView.findMany({
    where: {
      userId: user.id,
      createdAt: { gte: startDate },
    },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  // Group by day
  const grouped: Record<string, number> = {}
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    const key = date.toISOString().split('T')[0]
    grouped[key] = 0
  }

  views.forEach(v => {
    const key = v.createdAt.toISOString().split('T')[0]
    if (grouped[key] !== undefined) {
      grouped[key]++
    }
  })

  return Object.entries(grouped).map(([date, count]) => ({
    date,
    views: count,
  }))
}

/* ─── Breakdowns ─────────────────────────────────────────────── */

function parseDevice(ua: string | null): { device: string; browser: string } {
  if (!ua) return { device: 'Desconhecido', browser: 'Desconhecido' }

  // Device
  let device = 'Desktop'
  if (/android/i.test(ua)) device = 'Android'
  else if (/iphone|ipad|ipod/i.test(ua)) device = 'iOS'
  else if (/mobile/i.test(ua)) device = 'Mobile'

  // Browser
  let browser = 'Outro'
  if (/edg\//i.test(ua)) browser = 'Edge'
  else if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome'
  else if (/firefox/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari'
  else if (/opera|opr/i.test(ua)) browser = 'Opera'

  return { device, browser }
}

function parseReferrerSource(ref: string | null): string {
  if (!ref) return 'Direto'
  try {
    const host = new URL(ref).hostname.replace('www.', '')
    if (host.includes('instagram')) return 'Instagram'
    if (host.includes('facebook') || host.includes('fb.com')) return 'Facebook'
    if (host.includes('twitter') || host.includes('x.com')) return 'X / Twitter'
    if (host.includes('tiktok')) return 'TikTok'
    if (host.includes('google')) return 'Google'
    if (host.includes('linkedin')) return 'LinkedIn'
    if (host.includes('youtube')) return 'YouTube'
    if (host.includes('whatsapp') || host.includes('wa.me')) return 'WhatsApp'
    if (host.includes('telegram') || host.includes('t.me')) return 'Telegram'
    return host.length > 30 ? host.slice(0, 27) + '...' : host
  } catch {
    return 'Direto'
  }
}

const COUNTRY_NAMES: Record<string, string> = {
  BR: '🇧🇷 Brasil', US: '🇺🇸 EUA', PT: '🇵🇹 Portugal', AR: '🇦🇷 Argentina',
  MX: '🇲🇽 México', CO: '🇨🇴 Colômbia', CL: '🇨🇱 Chile', PE: '🇵🇪 Peru',
  DE: '🇩🇪 Alemanha', FR: '🇫🇷 França', ES: '🇪🇸 Espanha', GB: '🇬🇧 Reino Unido',
  IT: '🇮🇹 Itália', JP: '🇯🇵 Japão', CA: '🇨🇦 Canadá', AU: '🇦🇺 Austrália',
  IN: '🇮🇳 Índia', AO: '🇦🇴 Angola', MZ: '🇲🇿 Moçambique',
}

export async function getAnalyticsBreakdowns(days: number = 30) {
  const user = await getCurrentUser()
  if (!user) return null

  const since = new Date()
  since.setDate(since.getDate() - days)

  const views = await prisma.pageView.findMany({
    where: { userId: user.id, createdAt: { gte: since } },
    select: { referrer: true, userAgent: true, country: true },
  })

  // Referrer breakdown
  const referrerMap: Record<string, number> = {}
  views.forEach(v => {
    const src = parseReferrerSource(v.referrer)
    referrerMap[src] = (referrerMap[src] || 0) + 1
  })
  const referrers = Object.entries(referrerMap)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Device breakdown
  const deviceMap: Record<string, number> = {}
  const browserMap: Record<string, number> = {}
  views.forEach(v => {
    const { device, browser } = parseDevice(v.userAgent)
    deviceMap[device] = (deviceMap[device] || 0) + 1
    browserMap[browser] = (browserMap[browser] || 0) + 1
  })
  const devices = Object.entries(deviceMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
  const browsers = Object.entries(browserMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // Country breakdown
  const countryMap: Record<string, number> = {}
  views.forEach(v => {
    const code = v.country || 'XX'
    const name = COUNTRY_NAMES[code] || `🌍 ${code}`
    countryMap[name] = (countryMap[name] || 0) + 1
  })
  const countries = Object.entries(countryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return { referrers, devices, browsers, countries, totalViews: views.length }
}

/* ─── CSV Export ──────────────────────────────────────────────── */

export async function exportAnalyticsCsv(days: number = 30): Promise<{ ok: true; csv: string } | { ok: false; error: string }> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Não autorizado' }

  const since = new Date()
  since.setDate(since.getDate() - days)

  const [views, clicks] = await Promise.all([
    prisma.pageView.findMany({
      where: { userId: user.id, createdAt: { gte: since } },
      select: { createdAt: true, referrer: true, userAgent: true, country: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.linkClick.findMany({
      where: { userId: user.id, createdAt: { gte: since } },
      include: { link: { select: { title: true, url: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  // Build CSV
  const lines: string[] = []
  lines.push('tipo,data,referrer,dispositivo,navegador,pais,link_titulo,link_url')

  for (const v of views) {
    const { device, browser } = parseDevice(v.userAgent)
    const ref = parseReferrerSource(v.referrer)
    const country = v.country ? (COUNTRY_NAMES[v.country] || v.country) : ''
    const date = v.createdAt.toISOString()
    lines.push(`pageview,"${date}","${ref}","${device}","${browser}","${country.replace(/"/g, '')}","",""`)
  }

  for (const c of clicks) {
    const date = c.createdAt.toISOString()
    const title = (c.link?.title || '').replace(/"/g, "'")
    const url = (c.link?.url || '').replace(/"/g, "'")
    lines.push(`click,"${date}","","","","","${title}","${url}"`)
  }

  return { ok: true, csv: lines.join('\n') }
}
