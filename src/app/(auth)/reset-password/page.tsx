'use client'

import Link from 'next/link'
import { useState } from 'react'
import { resetPassword } from '@/actions/auth'
import { Logo } from '@/components/ui/logo'

export default function ResetPasswordPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    setSuccess('')
    const result = await resetPassword(formData)
    if (result?.error) setError(result.error)
    if (result?.success) setSuccess(result.success)
    setLoading(false)
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <Logo size="md" />
        <h1 className="text-2xl font-bold mt-6 mb-2">Recuperar senha</h1>
        <p className="text-zinc-400 text-sm">Enviaremos um link de recuperação para seu email</p>
      </div>

      <div className="p-8 rounded-2xl border border-surface-border bg-surface-card">
        <form action={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}
          {success && (
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">{success}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-all disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-6">
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          ← Voltar para login
        </Link>
      </p>
    </div>
  )
}
