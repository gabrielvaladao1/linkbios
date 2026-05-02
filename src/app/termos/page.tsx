import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condições para uso do PáginaBio.',
}

const LAST_UPDATE = '26 de abril de 2026'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-surface-border/50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-lg font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            PáginaBio
          </Link>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
            ← Voltar ao site
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-sm text-zinc-500 mb-12">Última atualização: {LAST_UPDATE}</p>

        <section className="space-y-10 text-zinc-300 leading-relaxed">
          <div>
            <p>
              Estes Termos regem o uso da plataforma <strong className="text-white">PáginaBio</strong> (&quot;Serviço&quot;). Ao criar uma conta ou acessar o Serviço, você (&quot;Usuário&quot;) concorda integralmente com estes Termos. Se discordar, não use o Serviço.
            </p>
          </div>

          <Section title="1. Descrição do Serviço">
            <p>
              O PáginaBio é uma plataforma SaaS que permite ao Usuário criar uma página pública com seus links, integrar pagamentos via PIX (em planos pagos), receber visitantes e analisar métricas de engajamento.
            </p>
          </Section>

          <Section title="2. Conta">
            <ul className="list-disc pl-6 space-y-2">
              <li>É necessário ter pelo menos 13 anos para criar conta.</li>
              <li>Você é responsável por manter a senha em segredo. Atividades realizadas pela sua conta são de sua responsabilidade.</li>
              <li>Notifique-nos imediatamente em <a href="mailto:suporte@paginabio.com.br" className="text-brand-400 hover:text-brand-300">suporte@paginabio.com.br</a> em caso de uso não autorizado.</li>
              <li>Cada Usuário pode ter apenas uma conta gratuita. Múltiplas contas para burlar limites do plano grátis podem ser bloqueadas.</li>
            </ul>
          </Section>

          <Section title="3. Conteúdo do Usuário">
            <p>
              Você é o único responsável pelo conteúdo que publica na sua página (links, textos, imagens, número de WhatsApp). Ao publicar, você declara que:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Tem o direito de fazê-lo.</li>
              <li>O conteúdo não viola leis, direitos de terceiros ou estes Termos.</li>
              <li>Concede ao PáginaBio licença não exclusiva, mundial e gratuita para hospedar e exibir o conteúdo apenas na sua página pública e em comunicações relacionadas ao Serviço.</li>
            </ul>
          </Section>

          <Section title="4. Conduta proibida">
            <p>É proibido usar o Serviço para:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Distribuir malware, phishing, golpes ou conteúdo ilegal.</li>
              <li>Vender produtos ou serviços ilícitos no Brasil (drogas ilegais, armas sem registro, conteúdo adulto sem aviso, esquemas em pirâmide etc.).</li>
              <li>Discurso de ódio, ameaça, assédio, doxxing ou exploração de menores.</li>
              <li>Violar direitos autorais ou marcas registradas de terceiros.</li>
              <li>Tentativas de exploração técnica do Serviço (bypass de rate limit, injeção, scraping massivo, ataques de negação).</li>
              <li>Inflar artificialmente analytics, sejam suas ou de terceiros.</li>
            </ul>
            <p className="mt-3">
              O PáginaBio pode suspender ou encerrar contas que violem este item, sem reembolso.
            </p>
          </Section>

          <Section title="5. Planos e pagamentos">
            <ul className="list-disc pl-6 space-y-2">
              <li>O plano Grátis é mantido enquanto a conta estiver ativa.</li>
              <li>Planos pagos (Pro e Business) são cobrados mensalmente via Stripe, em reais (BRL).</li>
              <li>A renovação é automática. Você pode cancelar a qualquer momento pelo painel — o acesso ao plano permanece até o fim do período já pago.</li>
              <li>Reembolsos: o usuário tem direito a desistir em até 7 dias após a primeira contratação (Art. 49 do CDC). Após isso, não há reembolso proporcional.</li>
              <li>Mudanças de preço são comunicadas com 30 dias de antecedência por email.</li>
            </ul>
          </Section>

          <Section title="6. Disponibilidade e SLA">
            <p>
              Empenhamo-nos em manter o Serviço disponível 24/7, mas não garantimos disponibilidade absoluta. Janelas de manutenção e indisponibilidades pontuais não geram direito a reembolso, salvo se previstas em contrato específico (planos enterprise).
            </p>
          </Section>

          <Section title="7. Propriedade intelectual">
            <p>
              A marca PáginaBio, o software, o design, os textos e os templates são de propriedade do PáginaBio. Estes Termos não concedem licença para uso comercial da marca ou do código.
            </p>
            <p className="mt-3">
              Você mantém todos os direitos sobre o conteúdo que publica.
            </p>
          </Section>

          <Section title="8. Privacidade">
            <p>
              O tratamento de dados pessoais é regido pela <Link href="/privacidade" className="text-brand-400 hover:text-brand-300">Política de Privacidade</Link>, parte integrante destes Termos.
            </p>
          </Section>

          <Section title="9. Limitação de responsabilidade">
            <p>
              Na máxima extensão permitida pela lei, o PáginaBio não responde por:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Lucros cessantes, perda de oportunidade ou danos indiretos.</li>
              <li>Conteúdo publicado por Usuários.</li>
              <li>Falhas em serviços de terceiros (Stripe, provedores de pagamento, redes sociais).</li>
            </ul>
            <p className="mt-3">
              A responsabilidade total do PáginaBio em qualquer caso fica limitada ao valor pago pelo Usuário nos 12 meses anteriores ao evento.
            </p>
          </Section>

          <Section title="10. Encerramento">
            <ul className="list-disc pl-6 space-y-2">
              <li>Você pode encerrar a conta a qualquer momento pelas Configurações.</li>
              <li>Podemos encerrar contas que violem estes Termos, mediante aviso prévio quando possível.</li>
              <li>Após o encerramento, a página pública é desativada e os dados pessoais excluídos conforme a Política de Privacidade.</li>
            </ul>
          </Section>

          <Section title="11. Alterações nos Termos">
            <p>
              Estes Termos podem ser atualizados. Mudanças relevantes serão comunicadas por email com pelo menos 7 dias de antecedência. O uso continuado após a vigência implica aceitação.
            </p>
          </Section>

          <Section title="12. Lei aplicável e foro">
            <p>
              Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca do domicílio do Usuário (consumidor) para dirimir controvérsias.
            </p>
          </Section>

          <Section title="13. Contato">
            <p>
              Suporte: <a href="mailto:suporte@paginabio.com.br" className="text-brand-400 hover:text-brand-300">suporte@paginabio.com.br</a>.
              <br />
              Privacidade / DPO: <a href="mailto:privacidade@paginabio.com.br" className="text-brand-400 hover:text-brand-300">privacidade@paginabio.com.br</a>.
            </p>
          </Section>
        </section>

        <footer className="mt-16 pt-8 border-t border-surface-border/50 flex items-center justify-between text-sm text-zinc-500">
          <Link href="/privacidade" className="hover:text-zinc-300 transition-colors">Política de Privacidade</Link>
          <Link href="/" className="hover:text-zinc-300 transition-colors">PáginaBio</Link>
        </footer>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-white mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
