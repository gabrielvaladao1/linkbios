'use server'

import { getCurrentUser } from './auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const BUCKET = 'avatars'
const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function uploadAvatar(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  const file = formData.get('avatar') as File | null
  if (!file || file.size === 0) return { error: 'Nenhum arquivo selecionado' }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: 'Formato inválido. Use JPG, PNG, WebP ou GIF.' }
  }

  if (file.size > MAX_SIZE) {
    return { error: 'Arquivo muito grande. Máximo 2MB.' }
  }

  const supabase = await createClient()

  // Generate unique filename
  const ext = file.name.split('.').pop() || 'jpg'
  const fileName = `${user.id}/${Date.now()}.${ext}`

  // Delete old avatar if exists
  if (user.avatarUrl) {
    const oldPath = user.avatarUrl.split('/avatars/').pop()
    if (oldPath) {
      await supabase.storage.from(BUCKET).remove([oldPath])
    }
  }

  // Upload new avatar
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return { error: 'Erro ao enviar imagem. Tente novamente.' }
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName)

  // Update user profile
  await prisma.user.update({
    where: { id: user.id },
    data: { avatarUrl: urlData.publicUrl },
  })

  revalidatePath('/dashboard/aparencia')
  revalidatePath(`/${user.slug}`)

  return { success: true, url: urlData.publicUrl }
}

export async function removeAvatar() {
  const user = await getCurrentUser()
  if (!user) return { error: 'Não autenticado' }

  if (user.avatarUrl) {
    const supabase = await createClient()
    const oldPath = user.avatarUrl.split('/avatars/').pop()
    if (oldPath) {
      await supabase.storage.from(BUCKET).remove([oldPath])
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { avatarUrl: null },
  })

  revalidatePath('/dashboard/aparencia')
  revalidatePath(`/${user.slug}`)

  return { success: true }
}
