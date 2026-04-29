'use client'

import Link from 'next/link'
import { useState } from 'react'
import { signIn } from '@/actions/auth'
import { Logo } from '@/components/ui/logo'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <Logo size="md" />
        <h1 className="text-2xl font-bold mt-6 mb-2">Bem-vindo de volta</h1>
        <p className="text-zinc-400 text-sm">Entre na sua conta para gerenciar sua página</p>
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Senha
              </label>
              <Link href="/reset-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                Esqueceu?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-all hover:shadow-lg hover:shadow-brand-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-6">
        Não tem conta?{' '}
        <Link href="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Crie grátis
        </Link>
      </p>
    </div>
  )
}
