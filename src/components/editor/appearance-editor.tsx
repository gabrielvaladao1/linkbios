'use client'

import { useRef, useState, useTransition } from 'react'
import { updateProfile, updateAppearance } from '@/actions/profile'
import { uploadBanner, removeBanner } from '@/actions/banner'
import {
  TEMPLATES,
  getRoundnessRadius,
  getShadowCss,
  type Template,
  type ButtonStyle,
  type ButtonRoundness,
  type ButtonShadow,
  type HeaderLayout,
} from '@/config/templates'
import MobilePreview from './mobile-preview'
import AvatarUpload from './avatar-upload'
import SocialIconsEditor from './social-icons-editor'

interface User {
  name: string | null
  bio: string | null
  whatsapp: string | null
  slug: string
  avatarUrl: string | null
  bannerUrl: string | null
  templateId: string
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
}

interface AppearanceEditorProps {
  user: User
  links: { id: string; title: string; url: string }[]
}

/* ─── Mini Phone Preview Card ─────────────────────────────────── */

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: Template
  isSelected: boolean
  onSelect: () => void
}) {
  const { bg, button, text } = template.defaultColors
  const isDark = isColorDark(bg)
  const nameColor = isDark ? '#e4e4e7' : '#27272a'
  const bioColor = isDark ? '#a1a1aa' : '#71717a'
  const iconColor = isDark ? '#a1a1aa' : '#52525b'
  const radius = getRoundnessRadius(template.buttonRoundness)
  const shadow = getShadowCss(template.buttonShadow, button)

  return (
    <button
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-brand-500 ring-offset-2 ring-offset-surface scale-[1.02]'
          : 'ring-1 ring-surface-border hover:ring-zinc-500 hover:scale-[1.02]'
      }`}
    >
      {/* Mini phone frame */}
      <div
        className="w-full aspect-[9/16] p-3 flex flex-col items-center"
        style={{ backgroundColor: bg }}
      >
        {template.headerLayout === 'hero' ? (
          <div
            className="w-full h-10 rounded-md mb-2"
            style={{
              background: `linear-gradient(135deg, ${button}80, ${button}40)`,
            }}
          />
        ) : null}

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full mt-1 mb-2 flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: button,
            color: text,
            marginTop: template.headerLayout === 'hero' ? '-20px' : '12px',
            border: template.headerLayout === 'hero' ? `2px solid ${bg}` : 'none',
          }}
        >
          SB
        </div>

        {/* Name */}
        <div
          className="text-[10px] font-semibold mb-0.5 truncate max-w-full px-1"
          style={{ color: nameColor }}
        >
          Seu Nome
        </div>

        {/* Bio */}
        <div
          className="text-[7px] mb-2 truncate max-w-full px-2"
          style={{ color: bioColor }}
        >
          Sua bio aqui
        </div>

        {/* Social icons mock */}
        <div className="flex gap-1.5 mb-3">
          {['IG', 'TT', 'YT'].map((icon) => (
            <div
              key={icon}
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${iconColor}30` }}
            >
              <span style={{ color: iconColor, fontSize: '5px', fontWeight: 700 }}>
                {icon}
              </span>
            </div>
          ))}
        </div>

        {/* Button mockups */}
        <div className="w-full space-y-1.5 px-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full h-5 flex items-center justify-center"
              style={{
                backgroundColor:
                  template.buttonStyle === 'outline'
                    ? 'transparent'
                    : template.buttonStyle === 'glass'
                      ? `${button}20`
                      : button,
                border:
                  template.buttonStyle === 'outline'
                    ? `1px solid ${button}`
                    : template.buttonStyle === 'glass'
                      ? `1px solid ${button}40`
                      : 'none',
                borderRadius: radius,
                backdropFilter: template.buttonStyle === 'glass' ? 'blur(4px)' : undefined,
                boxShadow: shadow,
              }}
            >
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${50 + i * 8}%`,
                  backgroundColor:
                    template.buttonStyle === 'outline' ? button : text,
                  opacity: 0.7,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Label */}
      <div className="p-2 bg-surface-card border-t border-surface-border">
        <p className="text-xs font-medium text-center truncate">{template.name}</p>
      </div>

      {/* Selected badge */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  )
}

/* ─── Helpers ─────────────────────────────────────────────────── */

function isColorDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

/* ─── Segmented Control ───────────────────────────────────────── */

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="grid gap-1 p-1 rounded-xl bg-surface border border-surface-border" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
            value === opt.value
              ? 'bg-brand-600 text-white shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

/* ─── Banner Uploader (inline) ────────────────────────────────── */

function BannerUploader({
  currentUrl,
  onChange,
}: {
  currentUrl: string | null
  onChange: (url: string | null) => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5MB.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Use JPG, PNG ou WebP.')
      return
    }

    setError('')
    const formData = new FormData()
    formData.append('banner', file)

    startTransition(async () => {
      const result = await uploadBanner(formData)
      if (result.error) setError(result.error)
      else if (result.url) onChange(result.url)
    })
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeBanner()
      if (result.error) setError(result.error)
      else onChange(null)
    })
  }

  return (
    <div className="space-y-3">
      {currentUrl ? (
        <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden border border-surface-border bg-surface">
          <img src={currentUrl} alt="Banner" className="w-full h-full object-cover" />
          {isPending && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
          className="w-full aspect-[3/1] rounded-xl border-2 border-dashed border-surface-border hover:border-brand-500 transition-colors flex items-center justify-center text-sm text-zinc-500 hover:text-zinc-300 disabled:opacity-50"
        >
          {isPending ? 'Enviando...' : '+ Enviar banner (JPG, PNG, WebP — até 5MB)'}
        </button>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isPending}
          className="px-4 py-2 rounded-xl bg-surface-hover hover:bg-zinc-700 text-sm font-medium transition-all disabled:opacity-50"
        >
          {currentUrl ? 'Trocar banner' : 'Adicionar banner'}
        </button>
        {currentUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-sm text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            Remover
          </button>
        )}
      </div>

      <p className="text-xs text-zinc-500">Recomendado: 1500×500px (3:1).</p>
      {error && <p className="text-xs text-red-400">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}

/* ─── Main Editor ─────────────────────────────────────────────── */

export default function AppearancePageClient({ user, links = [] }: AppearanceEditorProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedTemplate, setSelectedTemplate] = useState(user.templateId)
  const [colors, setColors] = useState({
    colorBg: user.colorBg,
    colorButton: user.colorButton,
    colorText: user.colorText,
  })
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>(user.buttonStyle)
  const [buttonRoundness, setButtonRoundness] = useState<ButtonRoundness>(user.buttonRoundness)
  const [buttonShadow, setButtonShadow] = useState<ButtonShadow>(user.buttonShadow)
  const [headerLayout, setHeaderLayout] = useState<HeaderLayout>(user.headerLayout)
  const [bannerUrl, setBannerUrl] = useState<string | null>(user.bannerUrl)
  const [leadsEnabled, setLeadsEnabled] = useState(user.leadsEnabled)
  const [leadsHeading, setLeadsHeading] = useState(user.leadsHeading || '')
  const [leadsButton, setLeadsButton] = useState(user.leadsButton || '')
  const [success, setSuccess] = useState('')
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  function handleSelectTemplate(templateId: string) {
    const template = TEMPLATES.find(t => t.id === templateId)
    if (!template) return
    setSelectedTemplate(templateId)
    setColors({
      colorBg: template.defaultColors.bg,
      colorButton: template.defaultColors.button,
      colorText: template.defaultColors.text,
    })
    setButtonStyle(template.buttonStyle)
    setButtonRoundness(template.buttonRoundness)
    setButtonShadow(template.buttonShadow)
    setHeaderLayout(template.headerLayout)
  }

  function handleSave() {
    startTransition(async () => {
      await updateAppearance({
        templateId: selectedTemplate,
        ...colors,
        buttonStyle,
        buttonRoundness,
        buttonShadow,
        headerLayout,
        leadsEnabled,
        leadsHeading: leadsHeading.trim() || null,
        leadsButton: leadsButton.trim() || null,
      })
      setSuccess('Salvo!')
      setTimeout(() => setSuccess(''), 2000)
    })
  }

  function handleProfileSave(formData: FormData) {
    startTransition(async () => {
      await updateProfile(formData)
      setSuccess('Perfil salvo!')
      setTimeout(() => setSuccess(''), 2000)
    })
  }

  return (
  <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8 lg:items-start">
    <div className="space-y-8">

      {/* Avatar */}
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
        <h3 className="font-semibold mb-4">Foto de perfil</h3>
        <AvatarUpload
          currentUrl={user.avatarUrl}
          userName={user.name}
          slug={user.slug}
        />
      </div>

      {/* Profile */}
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
        <h3 className="font-semibold mb-4">Perfil</h3>
        <form action={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Nome</label>
            <input name="name" defaultValue={user.name || ''} placeholder="Seu nome" className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Bio</label>
            <textarea name="bio" defaultValue={user.bio || ''} placeholder="Uma frase sobre você" maxLength={160} rows={2} className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 text-sm resize-none" />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">WhatsApp</label>
            <input name="whatsapp" defaultValue={user.whatsapp || ''} placeholder="5511999999999" className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 text-sm" />
          </div>
          <button type="submit" disabled={isPending} className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all disabled:opacity-50">
            {isPending ? 'Salvando...' : 'Salvar perfil'}
          </button>
        </form>
      </div>

      {/* Templates — Visual Grid */}
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Selecione um tema</h3>
          <span className="text-xs text-zinc-500">{TEMPLATES.length} temas</span>
        </div>
        <p className="text-zinc-400 text-sm mb-6">
          Escolha um ponto de partida — você pode customizar tudo depois.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {TEMPLATES.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              onSelect={() => handleSelectTemplate(template.id)}
            />
          ))}
        </div>
      </div>

      {/* Header layout */}
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
        <h3 className="font-semibold mb-2">Header</h3>
        <p className="text-zinc-400 text-sm mb-4">
          Como sua foto e nome aparecem no topo da página.
        </p>

        <div className="mb-4">
          <Segmented
            options={[
              { value: 'classic', label: 'Classic — só avatar redondo' },
              { value: 'hero',    label: 'Hero — banner + avatar' },
            ]}
            value={headerLayout}
            onChange={setHeaderLayout}
          />
        </div>

        {headerLayout === 'hero' && (
          <BannerUploader currentUrl={bannerUrl} onChange={setBannerUrl} />
        )}
      </div>

      {/* Colors */}
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
        <h3 className="font-semibold mb-4">Cores</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'colorBg' as const, label: 'Fundo' },
            { key: 'colorButton' as const, label: 'Botões' },
            { key: 'colorText' as const, label: 'Texto dos botões' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm text-zinc-400 mb-2">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors[key]}
                  onChange={(e) => setColors({ ...colors, [key]: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-surface-border cursor-pointer"
                />
                <span className="text-xs text-zinc-500 font-mono">{colors[key]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card space-y-5">
        <div>
          <h3 className="font-semibold">Botões</h3>
          <p className="text-zinc-400 text-sm mt-1">
            Estilo, arredondamento e sombra dos seus links.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">Estilo</label>
          <Segmented<ButtonStyle>
            options={[
              { value: 'solid',   label: 'Solid' },
              { value: 'glass',   label: 'Glass' },
              { value: 'outline', label: 'Outline' },
            ]}
            value={buttonStyle}
            onChange={setButtonStyle}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">Arredondamento</label>
          <Segmented<ButtonRoundness>
            options={[
              { value: 'square',  label: 'Square' },
              { value: 'round',   label: 'Round' },
              { value: 'rounder', label: 'Rounder' },
              { value: 'full',    label: 'Full' },
            ]}
            value={buttonRoundness}
            onChange={setButtonRoundness}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">Sombra</label>
          <Segmented<ButtonShadow>
            options={[
              { value: 'none',   label: 'None' },
              { value: 'soft',   label: 'Soft' },
              { value: 'strong', label: 'Strong' },
              { value: 'hard',   label: 'Hard' },
            ]}
            value={buttonShadow}
            onChange={setButtonShadow}
          />
        </div>
      </div>

      {/* Lead capture */}
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">Captura de email</h3>
            <p className="text-zinc-400 text-sm mt-1">
              Adicione um formulário na sua página para coletar emails dos visitantes.
              <br />
              Veja os leads em <a href="/dashboard/leads" className="text-brand-400 hover:underline">/dashboard/leads</a>.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={leadsEnabled}
              onChange={(e) => setLeadsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-hover peer-checked:bg-brand-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5" />
          </label>
        </div>

        {leadsEnabled && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Título (opcional)</label>
              <input
                type="text"
                value={leadsHeading}
                onChange={(e) => setLeadsHeading(e.target.value.slice(0, 80))}
                placeholder="Receba novidades"
                maxLength={80}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Texto do botão (opcional)</label>
              <input
                type="text"
                value={leadsButton}
                onChange={(e) => setLeadsButton(e.target.value.slice(0, 30))}
                placeholder="Inscrever-se"
                maxLength={30}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Social Icons */}
      <SocialIconsEditor initialLinks={user.socialLinks || []} />

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-all disabled:opacity-50"
      >
        {isPending ? 'Salvando...' : 'Salvar aparência'}
      </button>

      {success && <span className="text-green-400 text-sm font-medium text-center block">{success}</span>}
    </div>

    {/* Mobile Preview — Desktop: sticky sidebar */}
    <div className="hidden lg:block self-start sticky top-4" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
      <div>
        <MobilePreview
          name={user.name}
          bio={user.bio}
          slug={user.slug}
          avatarUrl={user.avatarUrl}
          bannerUrl={bannerUrl}
          colorBg={colors.colorBg}
          colorButton={colors.colorButton}
          colorText={colors.colorText}
          fontFamily={user.fontFamily}
          buttonStyle={buttonStyle}
          buttonRoundness={buttonRoundness}
          buttonShadow={buttonShadow}
          headerLayout={headerLayout}
          leadsEnabled={leadsEnabled}
          leadsHeading={leadsHeading.trim() || null}
          leadsButton={leadsButton.trim() || null}
          socialLinks={user.socialLinks || []}
          links={links}
        />
      </div>
    </div>

    {/* Mobile Preview — Floating button for mobile */}
    <button
      onClick={() => setShowMobilePreview(!showMobilePreview)}
      className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-600/25 flex items-center justify-center transition-all active:scale-95"
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="5" y="2" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <line x1="9" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>

    {/* Mobile Preview — Modal for mobile */}
    {showMobilePreview && (
      <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowMobilePreview(false)}>
        <div onClick={(e) => e.stopPropagation()}>
          <MobilePreview
            name={user.name}
            bio={user.bio}
            slug={user.slug}
            avatarUrl={user.avatarUrl}
            bannerUrl={bannerUrl}
            colorBg={colors.colorBg}
            colorButton={colors.colorButton}
            colorText={colors.colorText}
            fontFamily={user.fontFamily}
            buttonStyle={buttonStyle}
            buttonRoundness={buttonRoundness}
            buttonShadow={buttonShadow}
            headerLayout={headerLayout}
            leadsEnabled={leadsEnabled}
            leadsHeading={leadsHeading.trim() || null}
            leadsButton={leadsButton.trim() || null}
            socialLinks={user.socialLinks || []}
            links={links}
          />
        </div>
      </div>
    )}
  </div>
  )
}
