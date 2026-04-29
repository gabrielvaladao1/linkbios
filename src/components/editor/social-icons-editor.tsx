'use client'

import { useState, useTransition } from 'react'
import { updateSocialLinks } from '@/actions/profile'
import { SOCIAL_PLATFORMS, detectPlatform } from '@/config/social-platforms'

interface SocialLink {
  platform: string
  url: string
}

export default function SocialIconsEditor({
  initialLinks,
}: {
  initialLinks: SocialLink[]
}) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks)
  const [newUrl, setNewUrl] = useState('')
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function handleAddLink() {
    if (!newUrl.trim()) return

    // Auto-detect platform from URL
    const detected = detectPlatform(newUrl)
    if (!detected) {
      setError('URL não reconhecida. Use links de Instagram, TikTok, YouTube, X, LinkedIn, Spotify, GitHub ou Facebook.')
      return
    }

    // Check if platform already exists
    if (links.some(l => l.platform === detected.id)) {
      setLinks(links.map(l => l.platform === detected.id ? { ...l, url: newUrl } : l))
    } else {
      setLinks([...links, { platform: detected.id, url: newUrl }])
    }

    setNewUrl('')
    setError('')
  }

  function handleRemoveLink(platform: string) {
    setLinks(links.filter(l => l.platform !== platform))
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateSocialLinks(links)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess('Social links salvos!')
        setError('')
        setTimeout(() => setSuccess(''), 2000)
      }
    })
  }

  function getPlatformInfo(platformId: string) {
    return SOCIAL_PLATFORMS.find(p => p.id === platformId)
  }

  return (
    <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold">Redes sociais</h3>
        {success && <span className="text-green-400 text-xs font-medium">{success}</span>}
      </div>
      <p className="text-zinc-400 text-sm mb-4">
        Cole a URL e detectamos a rede automaticamente.
      </p>

      {/* Current links */}
      {links.length > 0 && (
        <div className="space-y-2 mb-4">
          {links.map((link) => {
            const platform = getPlatformInfo(link.platform)
            if (!platform) return null
            return (
              <div
                key={link.platform}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-surface-border group"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 shrink-0 text-zinc-400"
                  fill="currentColor"
                >
                  <path d={platform.icon} />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{platform.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{link.url}</p>
                </div>
                <button
                  onClick={() => handleRemoveLink(link.platform)}
                  className="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remover"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add new */}
      <div className="flex gap-2">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => {
            setNewUrl(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
          placeholder="Cole o link da rede social..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 text-sm"
        />
        <button
          onClick={handleAddLink}
          className="px-4 py-2.5 rounded-xl bg-surface-hover hover:bg-zinc-700 text-sm font-medium transition-all shrink-0"
        >
          + Adicionar
        </button>
      </div>

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      {/* Supported platforms hint */}
      <div className="flex items-center gap-2 mt-3">
        {SOCIAL_PLATFORMS.slice(0, 6).map((p) => (
          <span key={p.id} title={p.name}>
            <svg
              viewBox="0 0 24 24"
              className={`w-4 h-4 ${links.some(l => l.platform === p.id) ? 'text-brand-400' : 'text-zinc-600'} transition-colors`}
              fill="currentColor"
            >
              <path d={p.icon} />
            </svg>
          </span>
        ))}
        <span className="text-[10px] text-zinc-600">+{SOCIAL_PLATFORMS.length - 6}</span>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={isPending}
        className="mt-4 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all disabled:opacity-50"
      >
        {isPending ? 'Salvando...' : 'Salvar redes sociais'}
      </button>
    </div>
  )
}
