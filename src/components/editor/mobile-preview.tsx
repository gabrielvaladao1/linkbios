'use client'

import { SOCIAL_PLATFORMS } from '@/config/social-platforms'
import {
  getRoundnessRadius,
  getShadowCss,
  type ButtonStyle,
  type ButtonRoundness,
  type ButtonShadow,
  type HeaderLayout,
} from '@/config/templates'

interface MobilePreviewProps {
  name: string | null
  bio: string | null
  slug: string
  avatarUrl: string | null
  bannerUrl: string | null
  colorBg: string
  colorButton: string
  colorText: string
  fontFamily: string
  buttonStyle: ButtonStyle
  buttonRoundness: ButtonRoundness
  buttonShadow: ButtonShadow
  headerLayout: HeaderLayout
  leadsEnabled: boolean
  leadsHeading: string | null
  leadsButton: string | null
  socialLinks: { platform: string; url: string }[]
  links: { id: string; title: string; url: string }[]
}

function isColorDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

export default function MobilePreview(props: MobilePreviewProps) {
  const {
    name, bio, slug, avatarUrl, bannerUrl,
    colorBg, colorButton, colorText, fontFamily,
    buttonStyle, buttonRoundness, buttonShadow, headerLayout,
    leadsEnabled, leadsHeading, leadsButton,
    socialLinks, links,
  } = props

  const isDark = isColorDark(colorBg)
  const textColor = isDark ? '#ffffff' : '#1f2937'
  const subtextColor = isDark ? '#d1d5db' : '#6b7280'
  const radius = getRoundnessRadius(buttonRoundness)
  const shadow = getShadowCss(buttonShadow, colorButton)

  return (
    <div className="flex flex-col items-center">
      {/* Phone URL bar */}
      <div className="w-[280px] bg-zinc-800 rounded-t-[2rem] pt-4 pb-0 px-4">
        <div className="flex items-center gap-2 bg-zinc-700 rounded-full px-3 py-1.5 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-[9px] text-zinc-400 truncate flex-1 text-center font-mono">
            paginabio.com.br/{slug}
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-zinc-500 shrink-0">
            <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Phone body */}
      <div
        className="w-[280px] h-[480px] overflow-y-auto overflow-x-hidden rounded-b-[2rem] transition-colors duration-300"
        style={{
          backgroundColor: colorBg,
          fontFamily: `'${fontFamily}', sans-serif`,
          scrollbarWidth: 'none',
        }}
      >
        {/* Hero banner */}
        {headerLayout === 'hero' && (
          <div className="w-full h-20 relative">
            {bannerUrl ? (
              <img src={bannerUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(135deg, ${colorButton}80, ${colorButton}30)`,
                }}
              />
            )}
          </div>
        )}

        <div
          className="flex flex-col items-center px-5 space-y-3"
          style={{
            paddingTop: headerLayout === 'hero' ? '0' : '24px',
            paddingBottom: '24px',
          }}
        >
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full overflow-hidden border-2 shrink-0 transition-colors duration-300"
            style={{
              borderColor: headerLayout === 'hero' ? colorBg : (isDark ? `${colorButton}40` : `${colorButton}20`),
              borderWidth: headerLayout === 'hero' ? '3px' : '2px',
              marginTop: headerLayout === 'hero' ? '-32px' : '0',
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-lg font-bold transition-colors duration-300"
                style={{ backgroundColor: colorButton, color: colorText }}
              >
                {(name || slug)[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Name */}
          <div className="text-center">
            <p
              className="text-sm font-bold transition-colors duration-300"
              style={{ color: textColor }}
            >
              {name || `@${slug}`}
            </p>
            {bio && (
              <p
                className="text-[10px] mt-1 leading-relaxed max-w-[200px] transition-colors duration-300"
                style={{ color: subtextColor }}
              >
                {bio}
              </p>
            )}
          </div>

          {/* Social Icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => {
                const platform = SOCIAL_PLATFORMS.find(p => p.id === link.platform)
                if (!platform) return null
                return (
                  <div
                    key={link.platform}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="w-3 h-3" fill={isDark ? '#e4e4e7' : '#374151'}>
                      <path d={platform.icon} />
                    </svg>
                  </div>
                )
              })}
            </div>
          )}

          {/* Links */}
          <div className="w-full space-y-2 pt-2">
            {(links.length > 0 ? links : [
              { id: '1', title: 'Meu primeiro link', url: '#' },
              { id: '2', title: 'Segundo link', url: '#' },
              { id: '3', title: 'Terceiro link', url: '#' },
            ]).map((link) => (
              <div
                key={link.id}
                className="w-full py-2.5 px-4 text-center text-[11px] font-medium transition-all duration-300"
                style={{
                  backgroundColor:
                    buttonStyle === 'outline'
                      ? 'transparent'
                      : buttonStyle === 'glass'
                        ? `${colorButton}20`
                        : colorButton,
                  color: buttonStyle === 'outline' ? colorButton : colorText,
                  border:
                    buttonStyle === 'outline'
                      ? `1.5px solid ${colorButton}`
                      : buttonStyle === 'glass'
                        ? `1px solid ${colorButton}40`
                        : 'none',
                  borderRadius: radius,
                  backdropFilter: buttonStyle === 'glass' ? 'blur(8px)' : undefined,
                  boxShadow: shadow,
                }}
              >
                {link.title}
              </div>
            ))}
          </div>

          {/* Lead capture mini */}
          {leadsEnabled && (
            <div
              className="w-full p-3 space-y-2 mt-2"
              style={{
                borderRadius: radius,
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              }}
            >
              <p className="text-[10px] font-medium text-center" style={{ color: textColor }}>
                {leadsHeading || 'Receba novidades'}
              </p>
              <div
                className="w-full py-2 px-3 text-[9px]"
                style={{
                  borderRadius: radius,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
                  color: isDark ? '#a1a1aa' : '#9ca3af',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                seu@email.com
              </div>
              <div
                className="w-full py-2 px-3 text-center text-[10px] font-medium"
                style={{
                  borderRadius: radius,
                  backgroundColor: colorButton,
                  color: colorText,
                }}
              >
                {leadsButton || 'Inscrever-se'}
              </div>
            </div>
          )}

          {/* Branding */}
          <p className="text-[8px] pt-2 opacity-40" style={{ color: subtextColor }}>
            ðŸ’œ Feito com PáginaBio
          </p>
        </div>
      </div>

      {/* Phone bottom bar */}
      <div className="w-[280px] h-5 bg-zinc-800 rounded-b-[2rem] flex items-center justify-center -mt-[1px]">
        <div className="w-24 h-1 bg-zinc-600 rounded-full" />
      </div>
    </div>
  )
}
