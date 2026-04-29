'use server'

import { getCurrentUser } from './auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const BUCKET = 'banners'
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function uploadBanner(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const file = formData.get('banner') as File | null
  if (!file || file.size === 0) return { error: 'Nenhum arquivo selecionado' }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Formato inválido. Use JPG, PNG ou WebP.' }
  }

  if (file.size > MAX_SIZE) {
    return { error: 'Arquivo muito grande. Máximo 5MB.' }
  }

  const supabase = await createClient()

  const ext = file.name.split('.').pop() || 'jpg'
  const fileName = `${user.id}/${Date.now()}.${ext}`

  if (user.bannerUrl) {
    const oldPath = user.bannerUrl.split('/banners/').pop()
    if (oldPath) {
      await supabase.storage.from(BUCKET).remove([oldPath])
    }
  }

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) {
    console.error('Banner upload error:', uploadError)
    return { error: 'Erro ao enviar imagem. Tente novamente.' }
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName)

  await prisma.user.update({
    where: { id: user.id },
    data: { bannerUrl: urlData.publicUrl },
  })

  revalidatePath('/dashboard/aparencia')
  revalidatePath(`/${user.slug}`)

  return { success: true, url: urlData.publicUrl }
}

export async function removeBanner() {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  if (user.bannerUrl) {
    const supabase = await createClient()
    const oldPath = user.bannerUrl.split('/banners/').pop()
    if (oldPath) {
      await supabase.storage.from(BUCKET).remove([oldPath])
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { bannerUrl: null },
  })

  revalidatePath('/dashboard/aparencia')
  revalidatePath(`/${user.slug}`)

  return { success: true }
}
