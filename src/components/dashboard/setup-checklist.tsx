'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SetupChecklistProps {
  hasLinks: boolean
  hasAvatar: boolean
  hasCustomTemplate: boolean
  hasSocialLinks: boolean
  hasShared: boolean
}

interface CheckStep {
  id: string
  label: string
  description: string
  href: string
  done: boolean
  icon: string
}

export default function SetupChecklist({
  hasLinks,
  hasAvatar,
  hasCustomTemplate,
  hasSocialLinks,
  hasShared,
}: SetupChecklistProps) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('PáginaBio_checklist_dismissed')
    if (stored === 'true') setDismissed(true)
  }, [])

  const steps: CheckStep[] = [
    {
      id: 'links',
      label: 'Adicionar seu primeiro link',
      description: 'Adicione pelo menos um link para sua pÃ¡gina',
      href: '/dashboard/links',
      done: hasLinks,
      icon: 'ðŸ”—',
    },
    {
      id: 'avatar',
      label: 'Foto de perfil',
      description: 'Envie uma foto para personalizar sua pÃ¡gina',
      href: '/dashboard/aparencia',
      done: hasAvatar,
      icon: 'ðŸ“¸',
    },
    {
      id: 'template',
      label: 'Personalizar aparÃªncia',
      description: 'Escolha um template e ajuste as cores',
      href: '/dashboard/aparencia',
      done: hasCustomTemplate,
      icon: 'ðŸŽ¨',
    },
    {
      id: 'social',
      label: 'Conectar redes sociais',
      description: 'Adicione seus perfis sociais',
      href: '/dashboard/aparencia',
      done: hasSocialLinks,
      icon: 'ðŸ“±',
    },
    {
      id: 'share',
      label: 'Compartilhar sua pÃ¡gina',
      description: 'Copie o link ou compartilhe nas redes',
      href: '/dashboard',
      done: hasShared,
      icon: 'ðŸš€',
    },
  ]

  const completedCount = steps.filter(s => s.done).length
  const totalSteps = steps.length
  const progress = Math.round((completedCount / totalSteps) * 100)
  const allDone = completedCount === totalSteps

  // Auto-dismiss when all done
  useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => {
        setDismissed(true)
        localStorage.setItem('PáginaBio_checklist_dismissed', 'true')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [allDone])

  if (dismissed) return null

  return (
    <div className="p-6 rounded-2xl border border-surface-border bg-surface-card relative overflow-hidden">
      {/* Progress glow */}
      <div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-brand-500 to-purple-500 transition-all duration-700 ease-out"
        style={{ width: `${progress}%` }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            {allDone ? 'ðŸŽ‰ Tudo pronto!' : 'ðŸš€ Configure sua pÃ¡gina'}
          </h3>
          <p className="text-sm text-zinc-400 mt-0.5">
            {allDone
              ? 'Sua pÃ¡gina estÃ¡ completa. Hora de crescer!'
              : `${completedCount} de ${totalSteps} passos concluÃ­dos`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Circular progress */}
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-surface-border"
              />
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke="url(#progress-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${progress * 0.94} 100`}
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-zinc-300">
              {progress}%
            </span>
          </div>

          {!allDone && (
            <button
              onClick={() => {
                setDismissed(true)
                localStorage.setItem('PáginaBio_checklist_dismissed', 'true')
              }}
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
              title="Dispensar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-1.5">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
              step.done
                ? 'opacity-60'
                : 'hover:bg-surface-hover'
            }`}
          >
            {/* Check circle */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
              step.done
                ? 'bg-green-500/20 text-green-400'
                : 'border-2 border-zinc-600 group-hover:border-brand-500'
            }`}>
              {step.done ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${step.done ? 'line-through text-zinc-500' : 'group-hover:text-white'}`}>
                {step.label}
              </p>
              {!step.done && (
                <p className="text-xs text-zinc-500 mt-0.5">{step.description}</p>
              )}
            </div>

            {/* Icon */}
            <span className="text-base shrink-0">{step.icon}</span>

            {/* Arrow for incomplete */}
            {!step.done && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-zinc-600 group-hover:text-brand-400 transition-colors shrink-0">
                <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

/**
 * Compact progress badge for the sidebar
 */
export function SetupProgressBadge({ completed, total }: { completed: number; total: number }) {
  if (completed >= total) return null

  return (
    <span className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-600/20 text-brand-400 text-[10px] font-bold">
      {completed}
    </span>
  )
}
