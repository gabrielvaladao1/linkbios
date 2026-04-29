'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { rateLimit } from '@/lib/rate-limit'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createHash } from 'crypto'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

const submitSchema = z.object({
  slug:     z.string().min(1).max(60),
  email:    z.string().email().max(254),
  honeypot: z.string().max(0).optional(), // bots preenchem; humanos não veem
})

async function getClientIpHash() {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  return createHash('sha256').update(ip).digest('hex').slice(0, 24)
}

/* ─── Submit (público) ─────────────────────────────────────────── */

export async function submitLead(input: {
  slug: string
  email: string
  honeypot?: string
}) {
  const parsed = submitSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Email inválido' }
  }

  // Honeypot preenchido = bot. Devolve sucesso fake pra não dar feedback.
  if (parsed.data.honeypot && parsed.data.honeypot.length > 0) {
    return { success: true }
  }

  const ipHash = await getClientIpHash()
  const limit = rateLimit(`leads:${ipHash}:${parsed.data.slug}`, 5, 60 * 60_000)
  if (!limit.ok) {
    return { error: 'Muitas tentativas. Tente novamente mais tarde.' }
  }

  const owner = await prisma.user.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true, leadsEnabled: true },
  })

  if (!owner || !owner.leadsEnabled) {
    return { error: 'Captura de email indisponível' }
  }

  const email = parsed.data.email.trim().toLowerCase()

  try {
    await prisma.lead.create({
      data: { userId: owner.id, email },
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      // Email já cadastrado — sucesso opaco para não vazar lista.
      return { success: true }
    }
    console.error('Lead submit error:', err)
    return { error: 'Não foi possível inscrever agora. Tente novamente.' }
  }

  return { success: true }
}

/* ─── List (autenticado, dono) ─────────────────────────────────── */

type ListLeadsResult =
  | { ok: true; leads: { id: string; email: string; createdAt: Date }[] }
  | { ok: false; error: string }

export async function listLeads(): Promise<ListLeadsResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Não autenticado' }

  const leads = await prisma.lead.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, createdAt: true },
  })

  return { ok: true, leads }
}

/* ─── Delete (autenticado, dono) ───────────────────────────────── */

export async function deleteLead(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const result = await prisma.lead.deleteMany({
    where: { id, userId: user.id },
  })

  if (result.count === 0) {
    return { error: 'Lead não encontrado' }
  }

  revalidatePath('/dashboard/leads')
  return { success: true }
}

/* ─── Export CSV (autenticado, dono) ───────────────────────────── */

type ExportLeadsResult =
  | { ok: true; csv: string }
  | { ok: false; error: string }

export async function exportLeadsCsv(): Promise<ExportLeadsResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Não autenticado' }

  const leads = await prisma.lead.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { email: true, createdAt: true },
  })

  const header = 'email,created_at\n'
  const rows = leads
    .map(l => `${escapeCsv(l.email)},${l.createdAt.toISOString()}`)
    .join('\n')

  return { ok: true, csv: header + rows }
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
