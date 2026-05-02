import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como o PáginaBio coleta, usa e protege seus dados pessoais — em conformidade com a LGPD.',
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
            ← Voltar ao site
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16 prose-content">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-sm text-zinc-500 mb-12">Última atualização: {LAST_UPDATE}</p>

        <section className="space-y-10 text-zinc-300 leading-relaxed">
          <div>
            <p>
              Esta Política descreve como o <strong className="text-white">PáginaBio</strong> trata seus dados pessoais. Ela está em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD) e com o Marco Civil da Internet (Lei nº 12.965/2014).
            </p>
            <p className="mt-3">
              Ao criar uma conta ou usar o PáginaBio, você concorda com os termos desta Política. Se discordar de qualquer ponto, não use o serviço.
            </p>
          </div>

          <Section title="1. Quem somos (Controlador)">
            <p>
              O PáginaBio é o controlador dos dados pessoais coletados. Para qualquer questão sobre privacidade, contate <a href="mailto:privacidade@paginabio.com.br" className="text-brand-400 hover:text-brand-300">privacidade@paginabio.com.br</a>.
            </p>
          </Section>

          <Section title="2. Quais dados coletamos">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Cadastro:</strong> email, senha (armazenada com hash, nunca em texto claro), nome de usuário (slug).</li>
              <li><strong className="text-white">Perfil:</strong> nome, bio, avatar, número de WhatsApp e links que você decidir publicar. Esses dados são públicos por natureza.</li>
              <li><strong className="text-white">Pagamento:</strong> processado pela Stripe (parceiro PCI-DSS). O PáginaBio armazena apenas um ID anônimo do cliente Stripe e dados da assinatura. <strong className="text-white">Nunca recebemos nem armazenamos número de cartão.</strong></li>
              <li><strong className="text-white">Analytics:</strong> visitas e cliques na sua página pública. Para deduplicar visitantes, geramos um <em>hash</em> SHA-256 do seu IP combinado com a data — o IP cru nunca é armazenado.</li>
              <li><strong className="text-white">Técnicos:</strong> User-Agent (truncado), referenciador da requisição (sanitizado), data e hora de acesso.</li>
            </ul>
          </Section>

          <Section title="3. Por que coletamos (finalidade e base legal)">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Execução de contrato</strong> (LGPD Art. 7º, V): cadastro, autenticação, processamento da assinatura e entrega da página pública.</li>
              <li><strong className="text-white">Legítimo interesse</strong> (Art. 7º, IX): analytics agregadas para você, prevenção a fraude, melhoria do produto.</li>
              <li><strong className="text-white">Cumprimento de obrigação legal</strong> (Art. 7º, II): retenção fiscal de dados de pagamento e logs (Marco Civil — 6 meses).</li>
            </ul>
          </Section>

          <Section title="4. Com quem compartilhamos">
            <p>Apenas com fornecedores estritamente necessários:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong className="text-white">Supabase</strong> — banco de dados, autenticação e armazenamento (subprocessador, hospedagem em AWS — região São Paulo).</li>
              <li><strong className="text-white">Vercel</strong> — hospedagem do site e edge network.</li>
              <li><strong className="text-white">Stripe</strong> — processamento de pagamentos.</li>
              <li><strong className="text-white">Resend</strong> — envio de emails transacionais (confirmação, recuperação de senha).</li>
            </ul>
            <p className="mt-3">
              Não vendemos seus dados. Não compartilhamos para fins de marketing de terceiros.
            </p>
          </Section>

          <Section title="5. Por quanto tempo guardamos">
            <ul className="list-disc pl-6 space-y-2">
              <li>Conta ativa: enquanto você usar o serviço.</li>
              <li>Após exclusão da conta: dados pessoais são apagados em até 30 dias. Logs e dados fiscais podem ser retidos pelo prazo legal (até 6 meses para logs, 5 anos para dados fiscais).</li>
              <li>Analytics: até 365 dias para planos pagos; 7 dias para o plano grátis.</li>
            </ul>
          </Section>

          <Section title="6. Seus direitos como titular (LGPD Art. 18)">
            <p>Você pode, a qualquer momento:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong className="text-white">Confirmar</strong> a existência de tratamento dos seus dados.</li>
              <li><strong className="text-white">Acessar</strong> seus dados — pelo painel ou pedindo export completo.</li>
              <li><strong className="text-white">Corrigir</strong> dados incompletos, inexatos ou desatualizados — direto no painel.</li>
              <li><strong className="text-white">Anonimizar, bloquear ou eliminar</strong> dados desnecessários ou tratados em desconformidade.</li>
              <li><strong className="text-white">Portar</strong> seus dados para outro fornecedor — botão &quot;Baixar meus dados&quot; nas Configurações.</li>
              <li><strong className="text-white">Excluir</strong> sua conta — botão &quot;Excluir minha conta&quot; nas Configurações. A ação é irreversível.</li>
              <li><strong className="text-white">Revogar consentimento</strong> e ser informado sobre o compartilhamento.</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer direito, use o painel ou escreva para <a href="mailto:privacidade@paginabio.com.br" className="text-brand-400 hover:text-brand-300">privacidade@paginabio.com.br</a>. Respondemos em até 15 dias.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              Usamos apenas cookies essenciais para autenticação (sessão do Supabase). Não usamos cookies de rastreamento publicitário. Se isso mudar, atualizaremos esta Política e exibiremos um banner de consentimento.
            </p>
          </Section>

          <Section title="8. Segurança">
            <p>
              Empregamos boas práticas técnicas e organizacionais: TLS em trânsito, criptografia em repouso (Supabase), Row Level Security no banco, princípio do menor privilégio, hashing de IPs em analytics. Nenhuma medida é 100% à prova — em caso de incidente que afete dados pessoais, comunicaremos a ANPD e os titulares conforme exigido pela LGPD.
            </p>
          </Section>

          <Section title="9. Crianças e adolescentes">
            <p>
              O PáginaBio não é destinado a menores de 13 anos. Se identificarmos uma conta nessa faixa, ela será removida.
            </p>
          </Section>

          <Section title="10. Alterações nesta Política">
            <p>
              Podemos atualizar esta Política para refletir mudanças no serviço ou na legislação. Mudanças relevantes serão comunicadas por email com pelo menos 7 dias de antecedência.
            </p>
          </Section>

          <Section title="11. Contato">
            <p>
              Encarregado pelo Tratamento de Dados (DPO) — <a href="mailto:privacidade@paginabio.com.br" className="text-brand-400 hover:text-brand-300">privacidade@paginabio.com.br</a>.
            </p>
            <p className="mt-3">
              Você também pode reclamar à <strong className="text-white">Autoridade Nacional de Proteção de Dados (ANPD)</strong> — <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300">gov.br/anpd</a>.
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
