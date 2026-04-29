import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PolÃ­tica de Privacidade',
  description: 'Como o PáginaBio coleta, usa e protege seus dados pessoais â€” em conformidade com a LGPD.',
}

const LAST_UPDATE = '26 de abril de 2026'

export default function PrivacyPage() {
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

      <main className="max-w-3xl mx-auto px-4 py-16 prose-content">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">PolÃ­tica de Privacidade</h1>
        <p className="text-sm text-zinc-500 mb-12">Ãšltima atualizaÃ§Ã£o: {LAST_UPDATE}</p>

        <section className="space-y-10 text-zinc-300 leading-relaxed">
          <div>
            <p>
              Esta PolÃ­tica descreve como o <strong className="text-white">PáginaBio</strong> trata seus dados pessoais. Ela estÃ¡ em conformidade com a Lei Geral de ProteÃ§Ã£o de Dados (Lei nÂº 13.709/2018 â€” LGPD) e com o Marco Civil da Internet (Lei nÂº 12.965/2014).
            </p>
            <p className="mt-3">
              Ao criar uma conta ou usar o PáginaBio, vocÃª concorda com os termos desta PolÃ­tica. Se discordar de qualquer ponto, nÃ£o use o serviÃ§o.
            </p>
          </div>

          <Section title="1. Quem somos (Controlador)">
            <p>
              O PáginaBio Ã© o controlador dos dados pessoais coletados. Para qualquer questÃ£o sobre privacidade, contate <a href="mailto:privacidade@paginabio.com.br" className="text-brand-400 hover:text-brand-300">privacidade@paginabio.com.br</a>.
            </p>
          </Section>

          <Section title="2. Quais dados coletamos">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Cadastro:</strong> email, senha (armazenada com hash, nunca em texto claro), nome de usuÃ¡rio (slug).</li>
              <li><strong className="text-white">Perfil:</strong> nome, bio, avatar, nÃºmero de WhatsApp e links que vocÃª decidir publicar. Esses dados sÃ£o pÃºblicos por natureza.</li>
              <li><strong className="text-white">Pagamento:</strong> processado pela Stripe (parceiro PCI-DSS). O PáginaBio armazena apenas um ID anÃ´nimo do cliente Stripe e dados da assinatura. <strong className="text-white">Nunca recebemos nem armazenamos nÃºmero de cartÃ£o.</strong></li>
              <li><strong className="text-white">Analytics:</strong> visitas e cliques na sua pÃ¡gina pÃºblica. Para deduplicar visitantes, geramos um <em>hash</em> SHA-256 do seu IP combinado com a data â€” o IP cru nunca Ã© armazenado.</li>
              <li><strong className="text-white">TÃ©cnicos:</strong> User-Agent (truncado), referenciador da requisiÃ§Ã£o (sanitizado), data e hora de acesso.</li>
            </ul>
          </Section>

          <Section title="3. Por que coletamos (finalidade e base legal)">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">ExecuÃ§Ã£o de contrato</strong> (LGPD Art. 7Âº, V): cadastro, autenticaÃ§Ã£o, processamento da assinatura e entrega da pÃ¡gina pÃºblica.</li>
              <li><strong className="text-white">LegÃ­timo interesse</strong> (Art. 7Âº, IX): analytics agregadas para vocÃª, prevenÃ§Ã£o a fraude, melhoria do produto.</li>
              <li><strong className="text-white">Cumprimento de obrigaÃ§Ã£o legal</strong> (Art. 7Âº, II): retenÃ§Ã£o fiscal de dados de pagamento e logs (Marco Civil â€” 6 meses).</li>
            </ul>
          </Section>

          <Section title="4. Com quem compartilhamos">
            <p>Apenas com fornecedores estritamente necessÃ¡rios:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong className="text-white">Supabase</strong> â€” banco de dados, autenticaÃ§Ã£o e armazenamento (subprocessador, hospedagem em AWS â€” regiÃ£o SÃ£o Paulo).</li>
              <li><strong className="text-white">Vercel</strong> â€” hospedagem do site e edge network.</li>
              <li><strong className="text-white">Stripe</strong> â€” processamento de pagamentos.</li>
              <li><strong className="text-white">Resend</strong> â€” envio de emails transacionais (confirmaÃ§Ã£o, recuperaÃ§Ã£o de senha).</li>
            </ul>
            <p className="mt-3">
              NÃ£o vendemos seus dados. NÃ£o compartilhamos para fins de marketing de terceiros.
            </p>
          </Section>

          <Section title="5. Por quanto tempo guardamos">
            <ul className="list-disc pl-6 space-y-2">
              <li>Conta ativa: enquanto vocÃª usar o serviÃ§o.</li>
              <li>ApÃ³s exclusÃ£o da conta: dados pessoais sÃ£o apagados em atÃ© 30 dias. Logs e dados fiscais podem ser retidos pelo prazo legal (atÃ© 6 meses para logs, 5 anos para dados fiscais).</li>
              <li>Analytics: atÃ© 365 dias para planos pagos; 7 dias para o plano grÃ¡tis.</li>
            </ul>
          </Section>

          <Section title="6. Seus direitos como titular (LGPD Art. 18)">
            <p>VocÃª pode, a qualquer momento:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong className="text-white">Confirmar</strong> a existÃªncia de tratamento dos seus dados.</li>
              <li><strong className="text-white">Acessar</strong> seus dados â€” pelo painel ou pedindo export completo.</li>
              <li><strong className="text-white">Corrigir</strong> dados incompletos, inexatos ou desatualizados â€” direto no painel.</li>
              <li><strong className="text-white">Anonimizar, bloquear ou eliminar</strong> dados desnecessÃ¡rios ou tratados em desconformidade.</li>
              <li><strong className="text-white">Portar</strong> seus dados para outro fornecedor â€” botÃ£o &quot;Baixar meus dados&quot; nas ConfiguraÃ§Ãµes.</li>
              <li><strong className="text-white">Excluir</strong> sua conta â€” botÃ£o &quot;Excluir minha conta&quot; nas ConfiguraÃ§Ãµes. A aÃ§Ã£o Ã© irreversÃ­vel.</li>
              <li><strong className="text-white">Revogar consentimento</strong> e ser informado sobre o compartilhamento.</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer direito, use o painel ou escreva para <a href="mailto:privacidade@paginabio.com.br" className="text-brand-400 hover:text-brand-300">privacidade@paginabio.com.br</a>. Respondemos em atÃ© 15 dias.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              Usamos apenas cookies essenciais para autenticaÃ§Ã£o (sessÃ£o do Supabase). NÃ£o usamos cookies de rastreamento publicitÃ¡rio. Se isso mudar, atualizaremos esta PolÃ­tica e exibiremos um banner de consentimento.
            </p>
          </Section>

          <Section title="8. SeguranÃ§a">
            <p>
              Empregamos boas prÃ¡ticas tÃ©cnicas e organizacionais: TLS em trÃ¢nsito, criptografia em repouso (Supabase), Row Level Security no banco, princÃ­pio do menor privilÃ©gio, hashing de IPs em analytics. Nenhuma medida Ã© 100% Ã  prova â€” em caso de incidente que afete dados pessoais, comunicaremos a ANPD e os titulares conforme exigido pela LGPD.
            </p>
          </Section>

          <Section title="9. CrianÃ§as e adolescentes">
            <p>
              O PáginaBio nÃ£o Ã© destinado a menores de 13 anos. Se identificarmos uma conta nessa faixa, ela serÃ¡ removida.
            </p>
          </Section>

          <Section title="10. AlteraÃ§Ãµes nesta PolÃ­tica">
            <p>
              Podemos atualizar esta PolÃ­tica para refletir mudanÃ§as no serviÃ§o ou na legislaÃ§Ã£o. MudanÃ§as relevantes serÃ£o comunicadas por email com pelo menos 7 dias de antecedÃªncia.
            </p>
          </Section>

          <Section title="11. Contato">
            <p>
              Encarregado pelo Tratamento de Dados (DPO) â€” <a href="mailto:privacidade@paginabio.com.br" className="text-brand-400 hover:text-brand-300">privacidade@paginabio.com.br</a>.
            </p>
            <p className="mt-3">
              VocÃª tambÃ©m pode reclamar Ã  <strong className="text-white">Autoridade Nacional de ProteÃ§Ã£o de Dados (ANPD)</strong> â€” <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300">gov.br/anpd</a>.
            </p>
          </Section>
        </section>

        <footer className="mt-16 pt-8 border-t border-surface-border/50 flex items-center justify-between text-sm text-zinc-500">
          <Link href="/termos" className="hover:text-zinc-300 transition-colors">Termos de Uso</Link>
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
