'use client'

import { useState, useTransition } from 'react'
import { submitLead } from '@/actions/leads'
import { getRoundnessRadius, type ButtonRoundness } from '@/config/templates'

interface LeadCaptureFormProps {
  slug: string
  heading: string | null
  buttonLabel: string | null
  colorButton: string
  colorText: string
  buttonRoundness: ButtonRoundness
  textColor: string
  subtextColor: string
  isDark: boolean
}

export function LeadCaptureForm({
  slug,
  heading,
  buttonLabel,
  colorButton,
  colorText,
  buttonRoundness,
  textColor,
  subtextColor,
  isDark,
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('') // bots preenchem
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const radius = getRoundnessRadius(buttonRoundness)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const result = await submitLead({ slug, email, honeypot })
      if (result.error) {
        setStatus('error')
        setError(result.error)
      } else {
        setStatus('success')
        setEmail('')
      }
    })
  }

  if (status === 'success') {
    return (
      <div
        className="w-full p-5 text-center"
        style={{
          borderRadius: radius,
          backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        }}
      >
        <p className="text-sm font-medium" style={{ color: textColor }}>
          ✓ Inscrição confirmada
        </p>
        <p className="text-xs mt-1" style={{ color: subtextColor }}>
          Você foi adicionado à lista.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-5 space-y-3"
      style={{
        borderRadius: radius,
        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      }}
    >
      <p className="text-sm font-medium text-center" style={{ color: textColor }}>
        {heading || 'Receba novidades'}
      </p>

      <input
        type="email"
        required
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
        className="w-full px-4 py-3 text-sm outline-none disabled:opacity-50"
        style={{
          borderRadius: radius,
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.9)',
          color: isDark ? '#fff' : '#1f2937',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        }}
      />

      {/* Honeypot — escondido de humanos, bots preenchem */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={isPending || email.length === 0}
        className="w-full py-3 px-6 text-sm font-medium transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
        style={{
          borderRadius: radius,
          backgroundColor: colorButton,
          color: colorText,
        }}
      >
        {isPending ? 'Enviando...' : buttonLabel || 'Inscrever-se'}
      </button>

      {error && (
        <p className="text-xs text-center" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}
    </form>
  )
}
