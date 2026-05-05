import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://paginabio.com.br'

export async function GET() {
  // Get all public user pages
  const users = await prisma.user.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/login', priority: '0.5', changefreq: 'monthly' },
    { url: '/signup', priority: '0.8', changefreq: 'monthly' },
    { url: '/termos', priority: '0.3', changefreq: 'yearly' },
    { url: '/privacidade', priority: '0.3', changefreq: 'yearly' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
${users
  .map(
    (user) => `  <url>
    <loc>${BASE_URL}/${user.slug}</loc>
    <lastmod>${user.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
