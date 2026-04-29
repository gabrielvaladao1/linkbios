import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="text-7xl mb-6 animate-float">🔗</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
          Página não encontrada
        </h1>
        <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
          Este link não existe ou foi removido. Que tal criar o seu?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-all hover:shadow-lg hover:shadow-brand-600/25"
          >
            Criar minha página grátis
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-surface-border hover:border-zinc-600 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
