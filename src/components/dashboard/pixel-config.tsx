'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { updatePixels } from '@/actions/profile'

interface PixelConfigProps {
  metaPixelId: string | null
  tiktokPixelId: string | null
  plan: string
}

export default function PixelConfig({ metaPixelId, tiktokPixelId, plan }: PixelConfigProps) {
  const [meta, setMeta] = useState(metaPixelId || '')
  const [tiktok, setTiktok] = useState(tiktokPixelId || '')
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const isFree = plan === 'FREE'

  function handleSave() {
    startTransition(async () => {
      const result = await updatePixels({
        metaPixelId: meta || null,
        tiktokPixelId: tiktok || null,
      })
      if ('error' in result) {
        setError(result.error!)
        setTimeout(() => setError(''), 3000)
      } else {
        setSuccess('Pixels salvos!')
        setTimeout(() => setSuccess(''), 2000)
      }
    })
  }

  return (
    <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">🎯 Pixel de Rastreamento</h3>
          <p className="text-xs text-zinc-500 mt-1">Rastreie conversões na sua página</p>
        </div>
        {isFree && (
          <span className="px-2 py-1 rounded-lg bg-brand-600/15 text-brand-400 text-xs font-medium">
            Pro+
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Meta Pixel */}
        <div>
          <label className="flex items-center gap-2 text-sm text-zinc-400 mb-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#1877F2" strokeWidth="1.5" />
              <path d="M10 4H9C7.89 4 7 4.89 7 6V8H6V10H7V14H9V10H10.5L11 8H9V6.5C9 6.22 9.22 6 9.5 6H10V4Z" fill="#1877F2" />
            </svg>
            Meta Pixel ID
          </label>
          <input
            value={meta}
            onChange={(e) => setMeta(e.target.value.replace(/\D/g, ''))}
            disabled={isFree}
            placeholder="Ex: 1234567890123456"
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-600 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        {/* TikTok Pixel */}
        <div>
          <label className="flex items-center gap-2 text-sm text-zinc-400 mb-1.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect width="16" height="16" rx="4" fill="#000" />
              <path d="M11.5 6.5C10.67 6.5 9.92 6.17 9.38 5.62V9.75C9.38 11.27 8.15 12.5 6.63 12.5C5.1 12.5 3.88 11.27 3.88 9.75C3.88 8.23 5.1 7 6.63 7V8.5C5.93 8.5 5.38 9.06 5.38 9.75C5.38 10.44 5.93 11 6.63 11C7.32 11 7.88 10.44 7.88 9.75V3.5H9.38C9.38 4.88 10.5 6 11.88 6V7.5" fill="#FE2C55" />
            </svg>
            TikTok Pixel ID
          </label>
          <input
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value.replace(/[^A-Z0-9]/gi, ''))}
            disabled={isFree}
            placeholder="Ex: C4ABCDEF1234"
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-600 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <button
          onClick={handleSave}
          disabled={isPending || isFree}
          className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all disabled:opacity-50"
        >
          {isPending ? 'Salvando...' : 'Salvar pixels'}
        </button>

        {isFree && (
          <p className="text-xs text-zinc-500 text-center">
            Faça upgrade para o{' '}
            <Link href="/dashboard/planos" className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors">
              Plano Pro
            </Link>{' '}
            para usar pixels de rastreamento.
          </p>
        )}
      </div>
    </div>
  )
}
