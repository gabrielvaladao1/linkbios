import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condiÃ§Ãµes para uso do PáginaBio.',
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
            â† Voltar ao site
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-sm text-zinc-500 mb-12">Ãšltima atualizaÃ§Ã£o: {LAST_UPDATE}</p>

        <section className="space-y-10 text-zinc-300 leading-relaxed">
          <div>
            <p>
              Estes Termos regem o uso da plataforma <strong className="text-white">PáginaBio</strong> (&quot;ServiÃ§o&quot;). Ao criar uma conta ou acessar o ServiÃ§o, vocÃª (&quot;UsuÃ¡rio&quot;) concorda integralmente com estes Termos. Se discordar, nÃ£o use o ServiÃ§o.
            </p>
          </div>

          <Section title="1. DescriÃ§Ã£o do ServiÃ§o">
            <p>
              O PáginaBio Ã© uma plataforma SaaS que permite ao UsuÃ¡rio criar uma pÃ¡gina pÃºblica com seus links, integrar pagamentos via PIX (em planos pagos), receber visitantes e analisar mÃ©tricas de engajamento.
            </p>
          </Section>

          <Section title="2. Conta">
            <ul className="list-disc pl-6 space-y-2">
              <li>Ã‰ necessÃ¡rio ter pelo menos 13 anos para criar conta.</li>
              <li>VocÃª Ã© responsÃ¡vel por manter a senha em segredo. Atividades realizadas pela sua conta sÃ£o de sua responsabilidade.</li>
              <li>Notifique-nos imediatamente em <a href="mailto:suporte@paginabio.com.br" className="text-brand-400 hover:text-brand-300">suporte@paginabio.com.br</a> em caso de uso nÃ£o autorizado.</li>
              <li>Cada UsuÃ¡rio pode ter apenas uma conta gratuita. MÃºltiplas contas para burlar limites do plano grÃ¡tis podem ser bloqueadas.</li>
            </ul>
          </Section>

          <Section title="3. ConteÃºdo do UsuÃ¡rio">
            <p>
              VocÃª Ã© o Ãºnico responsÃ¡vel pelo conteÃºdo que publica na sua pÃ¡gina (links, textos, imagens, nÃºmero de WhatsApp). Ao publicar, vocÃª declara que:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Tem o direito de fazÃª-lo.</li>
              <li>O conteÃºdo nÃ£o viola leis, direitos de terceiros ou estes Termos.</li>
              <li>Concede ao PáginaBio licenÃ§a nÃ£o exclusiva, mundial e gratuita para hospedar e exibir o conteÃºdo apenas na sua pÃ¡gina pÃºblica e em comunicaÃ§Ãµes relacionadas ao ServiÃ§o.</li>
            </ul>
          </Section>

          <Section title="4. Conduta proibida">
            <p>Ã‰ proibido usar o ServiÃ§o para:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Distribuir malware, phishing, golpes ou conteÃºdo ilegal.</li>
              <li>Vender produtos ou serviÃ§os ilÃ­citos no Brasil (drogas ilegais, armas sem registro, conteÃºdo adulto sem aviso, esquemas em pirÃ¢mide etc.).</li>
              <li>Discurso de Ã³dio, ameaÃ§a, assÃ©dio, doxxing ou exploraÃ§Ã£o de menores.</li>
              <li>Violar direitos autorais ou marcas registradas de terceiros.</li>
              <li>Tentativas de exploraÃ§Ã£o tÃ©cnica do ServiÃ§o (bypass de rate limit, injeÃ§Ã£o, scraping massivo, ataques de negaÃ§Ã£o).</li>
              <li>Inflar artificialmente analytics, sejam suas ou de terceiros.</li>
            </ul>
            <p className="mt-3">
              O PáginaBio pode suspender ou encerrar contas que violem este item, sem reembolso.
            </p>
          </Section>

          <Section title="5. Planos e pagamentos">
            <ul className="list-disc pl-6 space-y-2">
              <li>O plano GrÃ¡tis Ã© mantido enquanto a conta estiver ativa.</li>
              <li>Planos pagos (Pro e Business) sÃ£o cobrados mensalmente via Stripe, em reais (BRL).</li>
              <li>A renovaÃ§Ã£o Ã© automÃ¡tica. VocÃª pode cancelar a qualquer momento pelo painel â€” o acesso ao plano permanece atÃ© o fim do perÃ­odo jÃ¡ pago.</li>
              <li>Reembolsos: o usuÃ¡rio tem direito a desistir em atÃ© 7 dias apÃ³s a primeira contrataÃ§Ã£o (Art. 49 do CDC). ApÃ³s isso, nÃ£o hÃ¡ reembolso proporcional.</li>
              <li>MudanÃ§as de preÃ§o sÃ£o comunicadas com 30 dias de antecedÃªncia por email.</li>
            </ul>
          </Section>

          <Section title="6. Disponibilidade e SLA">
            <p>
              Empenhamo-nos em manter o ServiÃ§o disponÃ­vel 24/7, mas nÃ£o garantimos disponibilidade absoluta. Janelas de manutenÃ§Ã£o e indisponibilidades pontuais nÃ£o geram direito a reembolso, salvo se previstas em contrato especÃ­fico (planos enterprise).
            </p>
          </Section>

          <Section title="7. Propriedade intelectual">
            <p>
              A marca PáginaBio, o software, o design, os textos e os templates sÃ£o de propriedade do PáginaBio. Estes Termos nÃ£o concedem licenÃ§a para uso comercial da marca ou do cÃ³digo.
            </p>
            <p className="mt-3">
              VocÃª mantÃ©m todos os direitos sobre o conteÃºdo que publica.
            </p>
          </Section>

          <Section title="8. Privacidade">
            <p>
              O tratamento de dados pessoais Ã© regido pela <Link href="/privacidade" className="text-brand-400 hover:text-brand-300">PolÃ­tica de Privacidade</Link>, parte integrante destes Termos.
            </p>
          </Section>

          <Section title="9. LimitaÃ§Ã£o de responsabilidade">
            <p>
              Na mÃ¡xima extensÃ£o permitida pela lei, o PáginaBio nÃ£o responde por:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Lucros cessantes, perda de oportunidade ou danos indiretos.</li>
              <li>ConteÃºdo publicado por UsuÃ¡rios.</li>
              <li>Falhas em serviÃ§os de terceiros (Stripe, provedores de pagamento, redes sociais).</li>
            </ul>
            <p className="mt-3">
              A responsabilidade total do PáginaBio em qualquer caso fica limitada ao valor pago pelo UsuÃ¡rio nos 12 meses anteriores ao evento.
            </p>
          </Section>

          <Section title="10. Encerramento">
            <ul className="list-disc pl-6 space-y-2">
              <li>VocÃª pode encerrar a conta a qualquer momento pelas ConfiguraÃ§Ãµes.</li>
              <li>Podemos encerrar contas que violem estes Termos, mediante aviso prÃ©vio quando possÃ­vel.</li>
              <li>ApÃ³s o encerramento, a pÃ¡gina pÃºblica Ã© desativada e os dados pessoais excluÃ­dos conforme a PolÃ­tica de Privacidade.</li>
            </ul>
          </Section>

          <Section title="11. AlteraÃ§Ãµes nos Termos">
            <p>
              Estes Termos podem ser atualizados. MudanÃ§as relevantes serÃ£o comunicadas por email com pelo menos 7 dias de antecedÃªncia. O uso continuado apÃ³s a vigÃªncia implica aceitaÃ§Ã£o.
            </p>
          </Section>

          <Section title="12. Lei aplicÃ¡vel e foro">
            <p>
              Estes Termos sÃ£o regidos pelas leis brasileiras. Fica eleito o foro da comarca do domicÃ­lio do UsuÃ¡rio (consumidor) para dirimir controvÃ©rsias.
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
          <Link href="/privacidade" className="hover:text-zinc-300 transition-colors">PolÃ­tica de Privacidade</Link>
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
