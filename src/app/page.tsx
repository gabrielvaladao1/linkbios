import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            PáginaBio
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Como funciona</a>
            <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2">
              Entrar
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-600/25"
            >
              Criar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/10 border border-brand-600/20 text-brand-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            100% brasileiro, com PIX nativo
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            Sua bio merece{' '}
            <span className="gradient-text">
              mais que links
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Crie sua página de links profissional em 2 minutos. Venda por PIX, veja de onde vem seu público e conecte seu WhatsApp.{' '}
            <strong className="text-zinc-200">Grátis para sempre.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto text-center font-medium bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-xl hover:shadow-brand-600/25 hover:-translate-y-0.5 animate-pulse-glow"
            >
              Criar minha página grátis →
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto text-center text-zinc-400 hover:text-white px-8 py-4 rounded-2xl text-lg transition-colors border border-surface-border hover:border-zinc-600"
            >
              Ver como funciona
            </Link>
          </div>

          <p className="mt-6 text-sm text-zinc-500">Sem cartão de crédito. Sem enrolação.</p>
        </div>

        {/* Hero Visual */}
        <div className="max-w-3xl mx-auto mt-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative rounded-2xl border border-surface-border bg-surface-card p-1 shadow-2xl shadow-brand-600/5">
            <div className="rounded-xl bg-gradient-to-b from-zinc-800/50 to-surface-card p-8 md:p-12">
              {/* Mock PáginaBio page */}
              <div className="max-w-xs mx-auto space-y-4 stagger-children">
                <div className="text-center space-y-2">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 mx-auto flex items-center justify-center text-2xl shadow-lg shadow-brand-600/20">
                    🚀
                  </div>
                  <h3 className="font-semibold text-lg">@seunome</h3>
                  <p className="text-sm text-zinc-400">Criador de conteúdo • São Paulo</p>
                </div>
                {['Meu curso novo 🎓', 'Me siga no YouTube ▶️', 'E-book grátis 📚', 'Fale comigo no WhatsApp 💬'].map((text, i) => (
                  <div
                    key={i}
                    className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-center text-white text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-600/20 cursor-pointer"
                  >
                    {text}
                  </div>
                ))}
                <p className="text-center text-xs text-zinc-500 pt-2">
                  Feito com <span className="text-brand-400">PáginaBio</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <div className="flex flex-wrap items-center justify-center gap-8 text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['🟣', '🔵', '🟢', '🟡', '🔴'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-surface-card border-2 border-surface flex items-center justify-center text-xs">
                    {c}
                  </div>
                ))}
              </div>
              <span className="text-sm">+500 criadores já usam</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
              <span className="text-sm ml-1">4.9/5 avaliação</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 border-t border-surface-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Pronto em 3 passos
            </h2>
            <p className="text-zinc-400 text-lg">Do zero à página publicada em 2 minutos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            {[
              { step: '01', title: 'Crie sua conta', desc: 'Escolha seu @nome e pronto. Email + senha, sem burocracia.', icon: '✨' },
              { step: '02', title: 'Adicione seus links', desc: 'Cole suas URLs, escolha um template bonito e personalize as cores.', icon: '🔗' },
              { step: '03', title: 'Compartilhe', desc: 'Coloque o link na sua bio. Seus seguidores vão adorar.', icon: '🚀' },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="w-16 h-16 rounded-2xl bg-brand-600/10 border border-brand-600/20 flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 group-hover:bg-brand-600/20 transition-all duration-300">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-brand-500 tracking-widest uppercase">{item.step}</span>
                <h3 className="font-semibold text-lg mt-1 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-surface-border to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 border-t border-surface-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-medium tracking-widest uppercase">Features</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-2 mb-4">
              Tudo que o Linktree não tem
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Feito para quem vende e recebe no Brasil.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {[
              { icon: '💸', title: 'PIX nativo', desc: 'Receba pagamentos direto na sua página. QR Code instantâneo, sem intermediário.' },
              { icon: '📊', title: 'Analytics em português', desc: 'Visitas, cliques e origem do público. Dados reais, sem adivinhação.' },
              { icon: '💬', title: 'WhatsApp integrado', desc: 'Botão flutuante de WhatsApp. Porque no Brasil, WhatsApp é obrigatório.' },
              { icon: '⚡', title: 'Carrega em <1 segundo', desc: 'Páginas via CDN global. Mais rápido que Linktree, Stan e Beacons.' },
              { icon: '🎨', title: '14+ templates premium', desc: 'Minimalista, neon, gradiente, carnaval e muito mais. Todos incríveis no mobile.' },
              { icon: '💰', title: '75% mais barato', desc: 'R$14,90/mês vs R$80 do Linktree Pro. Mesmas features, preço justo.' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-surface-border bg-surface-card hover:border-brand-600/30 hover:bg-surface-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-600/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 px-4 border-t border-surface-border/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              PáginaBio vs Linktree
            </h2>
            <p className="text-zinc-400">Comparação direta.</p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden">
            <div className="grid grid-cols-3 text-center text-sm font-medium border-b border-surface-border">
              <div className="p-4 text-zinc-500">Feature</div>
              <div className="p-4 text-brand-400 bg-brand-600/5">PáginaBio Pro</div>
              <div className="p-4 text-zinc-500">Linktree Pro</div>
            </div>
            {[
              { feature: 'Preço mensal', smart: 'R$14,90/mês', link: 'R$80/mês' },
              { feature: 'Links', smart: 'Ilimitados', link: 'Ilimitados' },
              { feature: 'PIX nativo', smart: '✓', link: '✕' },
              { feature: 'WhatsApp', smart: '✓', link: '✕' },
              { feature: 'Em português', smart: '✓', link: '✕' },
              { feature: 'Analytics', smart: '✓', link: '✓' },
              { feature: 'Templates', smart: '14+', link: '∞' },
              { feature: 'Pixel Meta/TikTok', smart: '✓', link: '✓' },
              { feature: 'Domínio custom', smart: '✓', link: '✓' },
              { feature: 'Remover marca', smart: '✓', link: '✓' },
              { feature: 'Captura de emails', smart: '✓', link: '✓' },
              { feature: 'Pagar com PIX/Boleto', smart: '✓', link: '✕' },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 text-center text-sm ${i % 2 === 0 ? '' : 'bg-surface/50'}`}>
                <div className="p-3.5 text-zinc-400 text-left pl-6">{row.feature}</div>
                <div className={`p-3.5 font-medium bg-brand-600/5 ${row.smart === '✓' ? 'text-green-400' : row.smart === '✕' ? 'text-red-400' : 'text-white'}`}>{row.smart}</div>
                <div className={`p-3.5 ${row.link === '✓' ? 'text-green-400' : row.link === '✕' ? 'text-red-400' : 'text-zinc-300'}`}>{row.link}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 border-t border-surface-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-medium tracking-widest uppercase">Preços</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-2 mb-4">
              Preço justo, em real
            </h2>
            <p className="text-zinc-400 text-lg">Sem cobrar em dólar. Sem surpresa na fatura.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {/* Free */}
            <div className="p-8 rounded-2xl border border-surface-border bg-surface-card hover:border-zinc-600 transition-all">
              <h3 className="font-semibold text-lg mb-1">Grátis</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold">R$0</span>
                <span className="text-zinc-500 mb-1">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Links ilimitados', '3 templates', 'Analytics 30 dias', 'QR Code da página', 'Social icons', 'Marca PáginaBio'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-brand-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center py-3 rounded-xl border border-surface-border hover:border-zinc-600 text-sm font-medium transition-all hover:bg-surface-hover"
              >
                Começar grátis
              </Link>
            </div>

            {/* Pro */}
            <div className="relative p-8 rounded-2xl border-2 border-brand-600 bg-surface-card shadow-xl shadow-brand-600/10 hover:-translate-y-1 transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 rounded-full text-xs font-bold">
                MAIS POPULAR
              </div>
              <h3 className="font-semibold text-lg mb-1">Pro</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold">R$14,90</span>
                <span className="text-zinc-500 mb-1">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Links ilimitados', 'Todos os 14+ templates', 'Analytics completo', 'Sem marca PáginaBio', 'Domínio custom', 'Botão WhatsApp', 'Captura de emails', 'Pixel Meta/TikTok', 'PIX e Boleto'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-brand-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-sm font-medium transition-all hover:shadow-lg hover:shadow-brand-600/25"
              >
                Assinar Pro
              </Link>
            </div>

            {/* Business */}
            <div className="p-8 rounded-2xl border border-surface-border bg-surface-card hover:border-zinc-600 transition-all">
              <h3 className="font-semibold text-lg mb-1">Business</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold">R$29,90</span>
                <span className="text-zinc-500 mb-1">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Tudo do Pro', 'Mini-loja com PIX (0%)', 'Até 10 páginas', 'SEO avançado', 'Relatório PDF', 'Suporte prioritário'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-zinc-300">
                    <span className="text-brand-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center py-3 rounded-xl border border-surface-border hover:border-zinc-600 text-sm font-medium transition-all hover:bg-surface-hover"
              >
                Assinar Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 border-t border-surface-border/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-600/5 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Pronto para transformar sua bio?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Crie sua página em 2 minutos. Grátis para sempre.
          </p>
          <Link
            href="/signup"
            className="inline-block font-medium bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-xl hover:shadow-brand-600/25 hover:-translate-y-0.5"
          >
            Criar minha página grátis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-surface-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-display text-lg font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                PáginaBio
              </span>
              <p className="text-xs text-zinc-600 mt-1">Sua página de links profissional</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-500">
              <Link href="/login" className="hover:text-zinc-300 transition-colors">Entrar</Link>
              <Link href="/signup" className="hover:text-zinc-300 transition-colors">Criar conta</Link>
              <a href="#pricing" className="hover:text-zinc-300 transition-colors">Preços</a>
              <Link href="/termos" className="hover:text-zinc-300 transition-colors">Termos</Link>
              <Link href="/privacidade" className="hover:text-zinc-300 transition-colors">Privacidade</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-surface-border/30 text-center">
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} PáginaBio. Feito com 💜 no Brasil.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
