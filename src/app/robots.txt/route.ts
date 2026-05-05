const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://paginabio.com.br'

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Auth pages - no index
Disallow: /dashboard
Disallow: /auth
Disallow: /api

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml
`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
