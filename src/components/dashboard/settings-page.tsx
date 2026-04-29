'use client'

import { useState, useTransition } from 'react'
import { updateSlug } from '@/actions/profile'
import { signOut, deleteAccount, exportMyData } from '@/actions/auth'

interface User {
  slug: string
  email: string
  plan: string
}

export default function SettingsPageClient({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition()
  const [slug, setSlug] = useState(user.slug)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [exporting, setExporting] = useState(false)

  function handleSlugSave() {
    startTransition(async () => {
      const result = await updateSlug(slug)
      if (result?.error) setMessage({ type: 'error', text: result.error })
      else setMessage({ type: 'success', text: 'Slug atualizado!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    })
  }

  async function handleExport() {
    setExporting(true)
    try {
      const result = await exportMyData()
      if (result.error || !result.data) {
        setMessage({ type: 'error', text: result.error || 'Erro ao exportar' })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        return
      }
      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `PáginaBio-${user.slug}-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">ConfiguraÃ§Ãµes</h1>
          <p className="text-zinc-400 text-sm mt-1">Gerencie sua conta</p>
        </div>

        {/* Slug */}
        <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
          <h3 className="font-semibold mb-4">Seu link</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-surface-border bg-surface overflow-hidden flex-1">
              <span className="px-3 py-2.5 bg-surface-card text-zinc-500 text-sm border-r border-surface-border">paginabio.com.br/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 px-3 py-2.5 bg-transparent text-white text-sm outline-none"
              />
            </div>
            <button
              onClick={handleSlugSave}
              disabled={isPending || slug === user.slug}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all disabled:opacity-50"
            >
              Salvar
            </button>
          </div>
          {message.text && (
            <p className={`mt-2 text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
              {message.text}
            </p>
          )}
        </div>

        {/* Account Info */}
        <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
          <h3 className="font-semibold mb-4">Conta</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-zinc-400">Email</span>
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-zinc-400">Plano</span>
              <span className="text-sm font-medium text-brand-400">{user.plan === 'FREE' ? 'GrÃ¡tis' : user.plan}</span>
            </div>
          </div>
        </div>

        {/* Privacy & Data (LGPD) */}
        <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
          <h3 className="font-semibold mb-2">Seus dados</h3>
          <p className="text-sm text-zinc-400 mb-4">
            Direito Ã  portabilidade (LGPD Art. 18). Baixe um JSON com tudo que armazenamos sobre vocÃª.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-5 py-2.5 rounded-xl border border-surface-border hover:border-zinc-600 text-zinc-200 hover:bg-surface-hover text-sm font-medium transition-all disabled:opacity-50"
          >
            {exporting ? 'Preparando...' : 'Baixar meus dados (JSON)'}
          </button>
        </div>

        {/* Sign Out */}
        <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
          <h3 className="font-semibold mb-2">Sair</h3>
          <p className="text-sm text-zinc-400 mb-4">Encerra a sessÃ£o neste dispositivo.</p>
          <form action={signOut}>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl border border-surface-border hover:border-zinc-600 text-zinc-200 text-sm font-medium transition-all"
            >
              Sair da conta
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
          <h3 className="font-semibold text-red-400 mb-2">Excluir conta</h3>
          <p className="text-sm text-zinc-400 mb-4">
            Apaga sua pÃ¡gina, seus links e todo o histÃ³rico de analytics. <strong className="text-zinc-300">Esta aÃ§Ã£o Ã© irreversÃ­vel.</strong> Se vocÃª tem assinatura ativa, ela Ã© cancelada imediatamente.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
          >
            Excluir minha conta
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </>
  )
}

function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const result = await deleteAccount(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // sucesso: action faz redirect, modal desmonta junto
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6 rounded-2xl border border-red-500/30 bg-surface-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-red-400 mb-2">Excluir minha conta</h3>
        <p className="text-sm text-zinc-400 mb-5">
          Para confirmar, digite sua senha e a palavra <code className="text-zinc-200 bg-surface px-1.5 py-0.5 rounded text-xs">EXCLUIR</code>. Esta aÃ§Ã£o Ã© permanente.
        </p>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm text-zinc-300 mb-1.5">Senha atual</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-border text-white text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm text-zinc-300 mb-1.5">
              Digite <code className="text-red-400 text-xs">EXCLUIR</code> para confirmar
            </label>
            <input
              id="confirm"
              name="confirm"
              type="text"
              required
              autoComplete="off"
              placeholder="EXCLUIR"
              className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-border text-white text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-surface-border hover:border-zinc-600 text-zinc-300 text-sm font-medium transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-all disabled:opacity-50"
            >
              {loading ? 'Excluindo...' : 'Excluir permanentemente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
