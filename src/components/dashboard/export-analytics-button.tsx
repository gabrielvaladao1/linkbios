'use client'

import { useState } from 'react'
import { exportAnalyticsCsv } from '@/actions/analytics'

export default function ExportAnalyticsButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const result = await exportAnalyticsCsv(30)
      if (!result.ok) return

      const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="px-4 py-2 rounded-xl border border-surface-border hover:border-zinc-600 text-zinc-300 text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-2"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1V9M7 9L4 6M7 9L10 6M2 11H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {loading ? 'Exportando...' : 'Exportar CSV'}
    </button>
  )
}
