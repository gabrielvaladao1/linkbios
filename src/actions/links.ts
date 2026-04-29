'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { PLANS } from '@/lib/stripe'

const linkSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(100),
  url: z.string().url('URL inválida'),
  icon: z.string().optional(),
})

export async function getLinks() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Não autenticado')

  return prisma.link.findMany({
    where: { userId: user.id },
    orderBy: { position: 'asc' },
  })
}

export async function createLink(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  // Check plan limits
  const plan = PLANS[user.plan]
  const linkCount = await prisma.link.count({ where: { userId: user.id } })
  if (linkCount >= plan.limits.maxLinks) {
    return { error: `Limite de ${plan.limits.maxLinks} links atingido. Faça upgrade para adicionar mais.` }
  }

  const parsed = linkSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    icon: formData.get('icon') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const maxPosition = await prisma.link.aggregate({
    where: { userId: user.id },
    _max: { position: true },
  })

  await prisma.link.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      url: parsed.data.url,
      icon: parsed.data.icon,
      position: (maxPosition._max.position ?? -1) + 1,
    },
  })

  revalidatePath('/dashboard/links')
  revalidatePath(`/${user.slug}`)
  return { success: true }
}

export async function updateLink(linkId: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const link = await prisma.link.findFirst({
    where: { id: linkId, userId: user.id },
  })
  if (!link) return { error: 'Link não encontrado' }

  const parsed = linkSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    icon: formData.get('icon') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  await prisma.link.update({
    where: { id: linkId },
    data: parsed.data,
  })

  revalidatePath('/dashboard/links')
  revalidatePath(`/${user.slug}`)
  return { success: true }
}

export async function deleteLink(linkId: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const link = await prisma.link.findFirst({
    where: { id: linkId, userId: user.id },
  })
  if (!link) return { error: 'Link não encontrado' }

  await prisma.link.delete({ where: { id: linkId } })

  revalidatePath('/dashboard/links')
  revalidatePath(`/${user.slug}`)
  return { success: true }
}

export async function toggleLink(linkId: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const link = await prisma.link.findFirst({
    where: { id: linkId, userId: user.id },
  })
  if (!link) return { error: 'Link não encontrado' }

  await prisma.link.update({
    where: { id: linkId },
    data: { isActive: !link.isActive },
  })

  revalidatePath('/dashboard/links')
  revalidatePath(`/${user.slug}`)
  return { success: true }
}

export async function reorderLinks(linkIds: string[]) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  // Update positions in a transaction
  await prisma.$transaction(
    linkIds.map((id, index) =>
      prisma.link.updateMany({
        where: { id, userId: user.id },
        data: { position: index },
      })
    )
  )

  revalidatePath('/dashboard/links')
  revalidatePath(`/${user.slug}`)
  return { success: true }
}
