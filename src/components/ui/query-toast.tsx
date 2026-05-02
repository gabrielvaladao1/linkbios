'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function QueryToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const deleted = searchParams.get('deleted')
    const upgrade = searchParams.get('upgrade')

    if (deleted === '1') {
      setToast({ message: 'Sua conta foi excluída com sucesso.', type: 'success' })
    } else if (deleted === 'error') {
      setToast({ message: 'Erro ao excluir conta. Tente novamente.', type: 'error' })
    } else if (upgrade === 'success') {
      setToast({ message: 'Plano atualizado com sucesso! 🎉', type: 'success' })
    }

    // Clean up URL params
    if (deleted || upgrade) {
      const url = new URL(window.location.href)
      url.searchParams.delete('deleted')
      url.searchParams.delete('upgrade')
      router.replace(url.pathname, { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  if (!toast) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-fade-in">
      <div
        className={`px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-medium flex items-center gap-3 ${
          toast.type === 'success'
            ? 'bg-green-500/15 border-green-500/30 text-green-400 shadow-green-500/10'
            : 'bg-red-500/15 border-red-500/30 text-red-400 shadow-red-500/10'
        }`}
      >
        <span className="text-lg">{toast.type === 'success' ? '✅' : '❌'}</span>
        {toast.message}
        <button
          onClick={() => setToast(null)}
          className="ml-2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
