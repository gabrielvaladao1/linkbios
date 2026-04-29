'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import { signUp, checkSlugAvailability } from '@/actions/auth'
import { slugify } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'

export default function SignupPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [slug, setSlug] = useState('')
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [slugChecking, setSlugChecking] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null)

  const checkSlug = useCallback(async (value: string) => {
    const clean = slugify(value)
    setSlug(clean)
    if (clean.length < 2) {
      setSlugAvailable(null)
      return
    }
    setSlugChecking(true)
    const result = await checkSlugAvailability(clean)
    setSlugAvailable(result.available)
    setSlugChecking(false)
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    formData.set('slug', slug)
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    if (result?.verifyEmail) {
      setVerifyEmail(result.email ?? '')
      setLoading(false)
    }
  }

  if (verifyEmail !== null) {
    return (
      <div className="animate-fade-in">
        <div className="text-center mb-8">
          <Logo size="md" />
          <h1 className="text-2xl font-bold mt-6 mb-2">Confira seu email</h1>
          <p className="text-zinc-400 text-sm">
            Enviamos um link de confirmaÃ§Ã£o para
            <br />
            <strong className="text-zinc-200">{verifyEmail || 'seu email'}</strong>
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-surface-border bg-surface-card space-y-4">
          <p className="text-sm text-zinc-300 leading-relaxed">
            Clique no link do email para ativar sua conta. Depois disso, Ã© sÃ³ fazer login.
          </p>
          <div className="text-xs text-zinc-500 leading-relaxed">
            <p className="mb-1.5">NÃ£o chegou em alguns minutos?</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verifique a pasta de spam.</li>
              <li>Confirme se digitou o email certo.</li>
            </ul>
          </div>
          <Link
            href="/login"
            className="block w-full text-center py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-all"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <Logo size="md" />
        <h1 className="text-2xl font-bold mt-6 mb-2">Crie sua pÃ¡gina grÃ¡tis</h1>
        <p className="text-zinc-400 text-sm">Em 2 minutos sua pÃ¡gina estÃ¡ no ar</p>
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
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="MÃ­nimo 8 caracteres"
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-border text-white placeholder:text-zinc-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Pelo menos 8 caracteres, com letras e nÃºmeros.
            </p>
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-zinc-300 mb-1.5">
              Seu link
            </label>
            <div className="flex items-center gap-0 rounded-xl border border-surface-border bg-surface overflow-hidden focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-colors">
              <span className="px-4 py-3 bg-surface-card text-zinc-500 text-sm border-r border-surface-border shrink-0">
                paginabio.com.br/
              </span>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => checkSlug(e.target.value)}
                placeholder="seunome"
                className="flex-1 px-3 py-3 bg-transparent text-white placeholder:text-zinc-500 outline-none text-sm"
              />
              {slug.length >= 2 && (
                <span className="pr-3">
                  {slugChecking ? (
                    <span className="text-zinc-500 text-xs">...</span>
                  ) : slugAvailable ? (
                    <span className="text-green-400 text-sm">âœ“</span>
                  ) : (
                    <span className="text-red-400 text-sm">âœ—</span>
                  )}
                </span>
              )}
            </div>
            {slug.length >= 2 && !slugChecking && slugAvailable === false && (
              <p className="mt-1 text-xs text-red-400">Este nome jÃ¡ estÃ¡ em uso</p>
            )}
            {slug.length >= 2 && !slugChecking && slugAvailable === true && (
              <p className="mt-1 text-xs text-green-400">DisponÃ­vel! ðŸŽ‰</p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || slugAvailable === false}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-all hover:shadow-lg hover:shadow-brand-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar minha pÃ¡gina grÃ¡tis'}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-500 mt-6">
        JÃ¡ tem conta?{' '}
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Entrar
        </Link>
      </p>

      <p className="text-center text-xs text-zinc-600 mt-4 leading-relaxed">
        Ao criar uma conta, vocÃª concorda com os{' '}
        <Link href="/termos" className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2">Termos de Uso</Link>
        {' '}e a{' '}
        <Link href="/privacidade" className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2">PolÃ­tica de Privacidade</Link>.
      </p>
    </div>
  )
}
