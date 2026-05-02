'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { deleteLead, exportLeadsCsv } from '@/actions/leads'

interface Lead {
  id: string
  email: string
  createdAt: string
}

interface LeadsPageClientProps {
  leads: Lead[]
  enabled: boolean
}

export default function LeadsPageClient({ leads: initialLeads, enabled }: LeadsPageClientProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleExport() {
    startTransition(async () => {
      const result = await exportLeadsCsv()
      if (!result.ok) {
        setError(result.error)
        return
      }

      const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `PáginaBio-leads-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Excluir este lead permanentemente?')) return

    startTransition(async () => {
      const result = await deleteLead(id)
      if (result.error) {
        setError(result.error)
        return
      }
      setLeads((prev) => prev.filter((l) => l.id !== id))
    })
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {leads.length} {leads.length === 1 ? 'email capturado' : 'emails capturados'}
            {!enabled && ' · captura desativada no momento'}
          </p>
        </div>

        {leads.length > 0 && (
          <button
            onClick={handleExport}
            disabled={isPending}
            className="px-4 py-2.5 rounded-xl bg-surface-hover hover:bg-zinc-700 text-sm font-medium transition-all disabled:opacity-50"
          >
            {isPending ? 'Gerando...' : '⬇ Exportar CSV'}
          </button>
        )}
      </div>

      {!enabled && (
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-sm text-yellow-200">
          A captura de email está desativada. Os leads abaixo continuam acessíveis, mas novos visitantes não conseguem se inscrever.{' '}
          <Link href="/dashboard/aparencia" className="underline hover:text-yellow-100">
            Ativar agora
          </Link>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-300">
          {error}
        </div>
      )}

      {leads.length === 0 ? (
        <div className="p-12 rounded-2xl border border-surface-border bg-surface-card text-center">
          <div className="text-5xl mb-4">🔭</div>
          <h3 className="font-semibold mb-2">Nenhum lead ainda</h3>
          <p className="text-zinc-400 text-sm max-w-sm mx-auto">
            Quando alguém preencher o formulário na sua página, o email aparecerá aqui.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface border-b border-surface-border">
              <tr>
                <th className="text-left text-xs font-medium text-zinc-400 px-4 py-3">Email</th>
                <th className="text-left text-xs font-medium text-zinc-400 px-4 py-3 hidden sm:table-cell">Inscrito em</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-surface-border last:border-0 hover:bg-surface-hover transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-mono">{lead.email}</td>
                  <td className="px-4 py-3 text-sm text-zinc-500 hidden sm:table-cell">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(lead.id)}
                      disabled={isPending}
                      className="text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50"
                      aria-label="Excluir lead"
                      title="Excluir"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 4H13M6 4V3C6 2.45 6.45 2 7 2H9C9.55 2 10 2.45 10 3V4M5 4V13C5 13.55 5.45 14 6 14H10C10.55 14 11 13.55 11 13V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
