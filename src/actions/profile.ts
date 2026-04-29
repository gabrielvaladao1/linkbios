'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().max(50).optional(),
  bio: z.string().max(160).optional(),
  whatsapp: z.string().max(20).optional(),
})

const appearanceSchema = z.object({
  templateId: z.string().optional(),
  colorBg: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  colorButton: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  colorText: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  fontFamily: z.string().optional(),
  buttonStyle: z.enum(['solid', 'glass', 'outline']).optional(),
  buttonRoundness: z.enum(['square', 'round', 'rounder', 'full']).optional(),
  buttonShadow: z.enum(['none', 'soft', 'strong', 'hard']).optional(),
  headerLayout: z.enum(['classic', 'hero']).optional(),
  leadsEnabled: z.boolean().optional(),
  leadsHeading: z.string().max(80).nullable().optional(),
  leadsButton: z.string().max(30).nullable().optional(),
})

const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
})

const socialLinksSchema = z.array(socialLinkSchema).max(10)

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const parsed = profileSchema.safeParse({
    name: formData.get('name') || undefined,
    bio: formData.get('bio') || undefined,
    whatsapp: formData.get('whatsapp') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
  })

  revalidatePath('/dashboard')
  revalidatePath(`/${user.slug}`)
  return { success: true }
}

export async function updateAppearance(data: {
  templateId?: string
  colorBg?: string
  colorButton?: string
  colorText?: string
  fontFamily?: string
  buttonStyle?: 'solid' | 'glass' | 'outline'
  buttonRoundness?: 'square' | 'round' | 'rounder' | 'full'
  buttonShadow?: 'none' | 'soft' | 'strong' | 'hard'
  headerLayout?: 'classic' | 'hero'
  leadsEnabled?: boolean
  leadsHeading?: string | null
  leadsButton?: string | null
}) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const parsed = appearanceSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
  })

  revalidatePath('/dashboard/aparencia')
  revalidatePath(`/${user.slug}`)
  return { success: true }
}

export async function updateSlug(newSlug: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const slugRegex = /^[a-z0-9][a-z0-9-]{1,29}$/
  if (!slugRegex.test(newSlug)) {
    return { error: 'Slug inválido: use apenas letras, números e hifens (2-30 caracteres)' }
  }

  const existing = await prisma.user.findUnique({ where: { slug: newSlug } })
  if (existing && existing.id !== user.id) {
    return { error: 'Este nome já está em uso' }
  }

  const oldSlug = user.slug
  await prisma.user.update({
    where: { id: user.id },
    data: { slug: newSlug },
  })

  revalidatePath(`/${oldSlug}`)
  revalidatePath(`/${newSlug}`)
  revalidatePath('/dashboard/configuracoes')
  return { success: true }
}

export async function updateSocialLinks(links: { platform: string; url: string }[]) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const parsed = socialLinksSchema.safeParse(links)
  if (!parsed.success) {
    return { error: 'Link inválido. Verifique as URLs.' }
  }

  // Deduplicate by platform (keep last)
  const unique = parsed.data.reduce(
    (acc, link) => {
      acc.set(link.platform, link)
      return acc
    },
    new Map<string, { platform: string; url: string }>()
  )

  await prisma.user.update({
    where: { id: user.id },
    data: { socialLinks: Array.from(unique.values()) },
  })

  revalidatePath('/dashboard/aparencia')
  revalidatePath(`/${user.slug}`)
  return { success: true }
}

/* ─── Pixel Tracking ─────────────────────────────────────────── */

const pixelSchema = z.object({
  metaPixelId: z.string().max(50).regex(/^\d*$/, 'Apenas números').nullable().optional(),
  tiktokPixelId: z.string().max(50).regex(/^[A-Z0-9]*$/i, 'ID inválido').nullable().optional(),
})

export async function updatePixels(data: z.infer<typeof pixelSchema>) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autorizado' }
  if (user.plan === 'FREE') return { error: 'Disponível no plano Pro+' }

  const parsed = pixelSchema.safeParse(data)
  if (!parsed.success) return { error: 'Dados inválidos' }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      metaPixelId: parsed.data.metaPixelId || null,
      tiktokPixelId: parsed.data.tiktokPixelId || null,
    },
  })

  revalidatePath(`/${user.slug}`)
  revalidatePath('/dashboard/configuracoes')
  return { success: true }
}
