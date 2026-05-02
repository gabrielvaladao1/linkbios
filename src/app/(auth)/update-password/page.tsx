'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/logo'
import PasswordInput from '@/components/ui/password-input'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    if (updateError) {
      setError(updateError.message === 'New password should be different from the old password.'
        ? 'A nova senha deve ser diferente da senha atual.'
        : 'Erro ao atualizar senha. Tente novamente.')
      setLoading(false)
      return
    }

    setSuccess('Senha atualizada com sucesso! Redirecionando...')
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <Logo size="md" />
        <h1 className="text-2xl font-bold mt-6 mb-2">Criar nova senha</h1>
        <p className="text-zinc-400 text-sm">Digite sua nova senha abaixo</p>
      </div>

      <div className="p-8 rounded-2xl border border-surface-border bg-surface-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordInput
            id="password"
            label="Nova senha"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirmar nova senha"
            placeholder="Digite a senha novamente"
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

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
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </div>
    </div>
  )
}
