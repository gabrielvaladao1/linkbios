import { getCurrentUser } from '@/actions/auth'
import { prisma } from '@/lib/prisma'
import LeadsPageClient from '@/components/dashboard/leads-page-client'
import Link from 'next/link'

export default async function LeadsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const leads = await prisma.lead.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, createdAt: true },
  })

  if (!user.leadsEnabled && leads.length === 0) {
    return (
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-zinc-400 text-sm mt-1">Emails capturados pela sua página.</p>
        </div>

        <div className="p-12 rounded-2xl border border-surface-border bg-surface-card text-center">
          <div className="text-5xl mb-4">📧</div>
          <h3 className="font-semibold mb-2">Captura de email desativada</h3>
          <p className="text-zinc-400 text-sm mb-6 max-w-sm mx-auto">
            Ative o formulário de captura na página de Aparência para começar a coletar emails.
          </p>
          <Link
            href="/dashboard/aparencia"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-all"
          >
            Ir para Aparência
          </Link>
        </div>
      </div>
    )
  }

  const serializable = leads.map(l => ({
    id: l.id,
    email: l.email,
    createdAt: l.createdAt.toISOString(),
  }))

  return (
    <LeadsPageClient
      leads={serializable}
      enabled={user.leadsEnabled}
    />
  )
}
