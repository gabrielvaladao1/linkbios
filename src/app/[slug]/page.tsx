import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Script from 'next/script'
import { PublicPageClient } from '@/components/public-page/public-page-client'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const user = await prisma.user.findUnique({
    where: { slug },
    select: { name: true, bio: true, slug: true, avatarUrl: true },
  })

  if (!user) return { title: 'Página não encontrada — PáginaBio' }

  const displayName = user.name || `@${user.slug}`
  const description = user.bio || `Confira os links de ${displayName} no PáginaBio`
  const url = `https://paginabio.com.br/${user.slug}`

  return {
    title: `${displayName} — PáginaBio`,
    description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: displayName,
      description,
      url,
      siteName: 'PáginaBio',
      type: 'profile',
      locale: 'pt_BR',
      ...(user.avatarUrl && {
        images: [{
          url: user.avatarUrl,
          width: 400,
          height: 400,
          alt: `Foto de ${displayName}`,
        }],
      }),
    },
    twitter: {
      card: user.avatarUrl ? 'summary_large_image' : 'summary',
      title: displayName,
      description,
      ...(user.avatarUrl && { images: [user.avatarUrl] }),
    },
  }
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params

  const user = await prisma.user.findUnique({
    where: { slug },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { position: 'asc' },
      },
    },
  })

  if (!user) notFound()

  // Pixel tracking (Pro+ only)
  const canTrack = user.plan !== 'FREE'
  const metaPixelId = canTrack ? user.metaPixelId : null
  const tiktokPixelId = canTrack ? user.tiktokPixelId : null

  return (
    <>
      <PublicPageClient
        user={{
          name: user.name,
          bio: user.bio,
          slug: user.slug,
          avatarUrl: user.avatarUrl,
          bannerUrl: user.bannerUrl,
          whatsapp: user.whatsapp,
          plan: user.plan,
          templateId: user.templateId,
          colorBg: user.colorBg,
          colorButton: user.colorButton,
          colorText: user.colorText,
          fontFamily: user.fontFamily,
          buttonStyle: user.buttonStyle as 'solid' | 'glass' | 'outline',
          buttonRoundness: user.buttonRoundness as 'square' | 'round' | 'rounder' | 'full',
          buttonShadow: user.buttonShadow as 'none' | 'soft' | 'strong' | 'hard',
          headerLayout: user.headerLayout as 'classic' | 'hero',
          hideBranding: user.hideBranding,
          leadsEnabled: user.leadsEnabled,
          leadsHeading: user.leadsHeading,
          leadsButton: user.leadsButton,
          socialLinks: (user.socialLinks as { platform: string; url: string }[]) || [],
        }}
        links={user.links.map(l => ({
          id: l.id,
          title: l.title,
          url: l.url,
        }))}
      />

      {/* Meta (Facebook) Pixel */}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}

      {/* TikTok Pixel */}
      {tiktokPixelId && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var i=d.createElement("script");i.type="text/javascript",i.async=!0,i.src=r+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(i,a)};ttq.load('${tiktokPixelId}');ttq.page()}(window,document,'ttq');`}
        </Script>
      )}
    </>
  )
}

// ISR: revalidate every 60 seconds
export const revalidate = 60
