import { prisma } from '@/lib/prisma'
import { rateLimit, maybeGc } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { z } from 'zod'

const trackSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('pageview'),
    slug: z.string().min(2).max(30).regex(/^[a-z0-9][a-z0-9-]*$/),
  }),
  z.object({
    type: z.literal('click'),
    slug: z.string().min(2).max(30).regex(/^[a-z0-9][a-z0-9-]*$/),
    linkId: z.string().uuid(),
  }),
])

function truncateUserAgent(ua: string | null): string | null {
  if (!ua) return null
  return ua.slice(0, 200)
}

function sanitizeReferrer(ref: string | null): string | null {
  if (!ref) return null
  try {
    const url = new URL(ref)
    return `${url.protocol}//${url.host}${url.pathname}`.slice(0, 300)
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    maybeGc()

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const today = new Date().toISOString().split('T')[0]
    const ipHash = createHash('sha256').update(`${ip}:${today}`).digest('hex')

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const parsed = trackSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const data = parsed.data

    const limit = rateLimit(`track:${ipHash}:${data.slug}`, 120, 60_000)
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Too many requests' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limit.resetAt - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    const user = await prisma.user.findUnique({
      where: { slug: data.slug },
      select: { id: true },
    })
    if (!user) {
      return NextResponse.json({ ok: true })
    }

    if (data.type === 'pageview') {
      const referrer = sanitizeReferrer(request.headers.get('referer'))
      const userAgent = truncateUserAgent(request.headers.get('user-agent'))
      // Country from Vercel/Cloudflare geo headers
      const country = request.headers.get('x-vercel-ip-country')
        || request.headers.get('cf-ipcountry')
        || null

      const existing = await prisma.pageView.findFirst({
        where: {
          userId: user.id,
          ipHash,
          createdAt: { gte: new Date(`${today}T00:00:00Z`) },
        },
        select: { id: true },
      })

      if (!existing) {
        await prisma.pageView.create({
          data: { userId: user.id, referrer, userAgent, country, ipHash },
        })
      }
    } else {
      const link = await prisma.link.findFirst({
        where: { id: data.linkId, userId: user.id },
        select: { id: true },
      })
      if (!link) {
        return NextResponse.json({ ok: true })
      }

      await prisma.linkClick.create({
        data: { linkId: link.id, userId: user.id },
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
