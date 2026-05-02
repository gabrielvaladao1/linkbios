'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[DashboardError]', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full p-6 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-red-300">Algo deu errado</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Encontramos um erro ao carregar essa parte do dashboard.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-black/30 border border-red-500/20">
          <p className="text-xs text-zinc-500 font-medium mb-1">Mensagem técnica:</p>
          <pre className="text-xs text-red-300 whitespace-pre-wrap break-words">
            {error.message || 'Erro desconhecido'}
          </pre>
          {error.digest && (
            <p className="text-[10px] text-zinc-600 mt-2">digest: {error.digest}</p>
          )}
        </div>

        <button
          onClick={reset}
          className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
