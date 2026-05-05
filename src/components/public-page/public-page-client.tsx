'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { SOCIAL_PLATFORMS } from '@/config/social-platforms'
import {
  getRoundnessRadius,
  getShadowCss,
  type ButtonStyle,
  type ButtonRoundness,
  type ButtonShadow,
  type HeaderLayout,
} from '@/config/templates'
import { LeadCaptureForm } from './lead-capture-form'

interface PublicPageProps {
  user: {
    name: string | null
    bio: string | null
    slug: string
    avatarUrl: string | null
    bannerUrl: string | null
    whatsapp: string | null
    plan: string
    templateId: string
    colorBg: string
    colorButton: string
    colorText: string
    fontFamily: string
    buttonStyle: ButtonStyle
    buttonRoundness: ButtonRoundness
    buttonShadow: ButtonShadow
    headerLayout: HeaderLayout
    hideBranding: boolean
    leadsEnabled: boolean
    leadsHeading: string | null
    leadsButton: string | null
    socialLinks: { platform: string; url: string }[]
  }
  links: {
    id: string
    title: string
    url: string
  }[]
}

function isColorDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

export function PublicPageClient({ user, links }: PublicPageProps) {
  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'pageview', slug: user.slug }),
    }).catch(() => {})
  }, [user.slug])

  function handleClick(linkId: string, url: string) {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'click', slug: user.slug, linkId }),
    }).catch(() => {})
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const isDark = isColorDark(user.colorBg)
  const textColor = isDark ? '#ffffff' : '#1f2937'
  const subtextColor = isDark ? '#d1d5db' : '#6b7280'
  const radius = getRoundnessRadius(user.buttonRoundness)
  const shadow = getShadowCss(user.buttonShadow, user.colorButton)
  const isHero = user.headerLayout === 'hero'

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ backgroundColor: user.colorBg, fontFamily: `'${user.fontFamily}', sans-serif` }}
    >
      {/* Hero banner */}
      {isHero && (
        <div className="w-full h-40 sm:h-56 relative">
          {user.bannerUrl ? (
            <img
              src={user.bannerUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, ${user.colorButton}80, ${user.colorButton}30)`,
              }}
            />
          )}
        </div>
      )}

      <div
        className="w-full max-w-md mx-auto px-4 space-y-8 pb-16"
        style={{ paddingTop: isHero ? '0' : '64px' }}
      >
        {/* Avatar + Name */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative inline-block">
            <div
              className="w-28 h-28 rounded-full overflow-hidden shadow-xl border-4"
              style={{
                borderColor: isHero
                  ? user.colorBg
                  : (isDark ? `${user.colorButton}40` : `${user.colorButton}20`),
                marginTop: isHero ? '-56px' : '0',
              }}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || user.slug}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-4xl font-bold"
                  style={{ backgroundColor: user.colorButton, color: user.colorText }}
                >
                  {(user.name || user.slug)[0].toUpperCase()}
                </div>
              )}
            </div>
            <div
              className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full"
              style={{
                border: `3px solid ${isHero ? user.colorBg : (isDark ? '#18181b' : user.colorBg)}`,
              }}
            />
          </div>
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: textColor }}
            >
              {user.name || `@${user.slug}`}
            </h1>
            {user.bio && (
              <p
                className="text-sm mt-2 max-w-xs mx-auto leading-relaxed opacity-80"
                style={{ color: subtextColor }}
              >
                {user.bio}
              </p>
            )}
          </div>

          {/* Social Icons */}
          {user.socialLinks && user.socialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-3 pt-1">
              {user.socialLinks.map((link) => {
                const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform)
                if (!platform) return null
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:-translate-y-0.5"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                    }}
                    title={platform.name}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill={isDark ? '#e4e4e7' : '#374151'}
                    >
                      <path d={platform.icon} />
                    </svg>
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link, i) => (
            <button
              key={link.id}
              onClick={() => handleClick(link.id, link.url)}
              className="w-full py-4 px-6 text-center font-medium text-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer active:scale-[0.98] animate-fade-in"
              style={{
                backgroundColor:
                  user.buttonStyle === 'outline'
                    ? 'transparent'
                    : user.buttonStyle === 'glass'
                      ? `${user.colorButton}25`
                      : user.colorButton,
                color: user.buttonStyle === 'outline' ? user.colorButton : user.colorText,
                border:
                  user.buttonStyle === 'outline'
                    ? `2px solid ${user.colorButton}`
                    : user.buttonStyle === 'glass'
                      ? `1px solid ${user.colorButton}40`
                      : 'none',
                borderRadius: radius,
                backdropFilter: user.buttonStyle === 'glass' ? 'blur(8px)' : undefined,
                boxShadow: shadow,
                animationDelay: `${0.1 + i * 0.08}s`,
                opacity: 0,
              }}
            >
              {link.title}
            </button>
          ))}
        </div>

        {/* Lead capture */}
        {user.leadsEnabled && (
          <LeadCaptureForm
            slug={user.slug}
            heading={user.leadsHeading}
            buttonLabel={user.leadsButton}
            colorButton={user.colorButton}
            colorText={user.colorText}
            buttonRoundness={user.buttonRoundness}
            textColor={textColor}
            subtextColor={subtextColor}
            isDark={isDark}
          />
        )}

        {/* WhatsApp */}
        {user.whatsapp && (
          <a
            href={`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 px-6 text-center font-medium text-sm bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/25 active:scale-[0.98] animate-fade-in"
            style={{
              borderRadius: radius,
              animationDelay: `${0.1 + links.length * 0.08 + 0.08}s`,
              opacity: 0,
            }}
          >
            ðŸ’¬ Fale comigo no WhatsApp
          </a>
        )}

        {/* Branding */}
        {!user.hideBranding && (
          <div className="text-center pt-4 animate-fade-in" style={{ animationDelay: '0.8s', opacity: 0 }}>
            <Link
              href="/?utm_source=branding&utm_medium=public_page&utm_campaign=viral"
              className="inline-flex items-center gap-1.5 text-xs opacity-50 hover:opacity-80 transition-opacity group"
              style={{ color: subtextColor }}
            >
              <span className="group-hover:scale-110 transition-transform">💜</span>
              Feito com PáginaBio
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
