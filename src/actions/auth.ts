'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { rateLimit } from '@/lib/rate-limit'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createHash } from 'crypto'
import { z } from 'zod'

async function getClientIpHash() {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  return createHash('sha256').update(ip).digest('hex').slice(0, 24)
}

function emailKey(email: string) {
  return createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 24)
}

const passwordSchema = z
  .string()
  .min(8, 'A senha precisa ter pelo menos 8 caracteres')
  .max(72, 'Senha muito longa')
  .regex(/[A-Za-z]/, 'A senha precisa conter pelo menos uma letra')
  .regex(/[0-9]/, 'A senha precisa conter pelo menos um número')

const signUpSchema = z.object({
  email: z.string().email('Email inválido').max(254),
  password: passwordSchema,
  slug: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .regex(/^[a-z0-9][a-z0-9-]*$/, 'Apenas letras minúsculas, números e hifens'),
})

const signInSchema = z.object({
  email: z.string().email('Email inválido').max(254),
  password: z.string().min(1, 'Senha é obrigatória').max(72),
})

const resetSchema = z.object({
  email: z.string().email('Email inválido').max(254),
})

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    slug: formData.get('slug'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const ipHash = await getClientIpHash()
  const limit = rateLimit(`signup:${ipHash}`, 3, 60 * 60_000)
  if (!limit.ok) {
    return { error: 'Muitas tentativas. Aguarde 1 hora antes de tentar de novo.' }
  }

  const { email, password, slug } = parsed.data

  // Check slug availability
  const existingUser = await prisma.user.findUnique({ where: { slug } })
  if (existingUser) {
    return { error: 'Este nome de usuário já está em uso' }
  }

  // Check reserved slugs
  const reserved = await prisma.$queryRaw<{ slug: string }[]>`
    SELECT slug FROM reserved_slugs WHERE slug = ${slug}
  `
  if (reserved.length > 0) {
    return { error: 'Este nome de usuário é reservado' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { slug },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // O trigger SQL `handle_new_user` (migration 0003) já criou public.users
  // com um slug derivado do email. Aqui sobrescrevemos com o slug que o
  // usuário escolheu no formulário. Upsert cobre o caso (raro) do trigger
  // não ter rodado ainda.
  if (data.user) {
    try {
      await prisma.user.upsert({
        where: { id: data.user.id },
        create: { id: data.user.id, email, slug },
        update: { slug },
      })
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code?: string }).code === 'P2002'
      ) {
        return { error: 'Este nome de usuário já está em uso' }
      }
      throw err
    }
  }

  // Se o Supabase Auth tem "Confirm email" ON, signUp não cria sessão até
  // o usuário clicar no link do email. Sem checar isso, redirect /dashboard
  // joga o user no /login e o login retorna "credenciais inválidas" porque
  // o Supabase bloqueia signInWithPassword até a confirmação.
  if (!data.session) {
    return { verifyEmail: true, email }
  }

  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const ipHash = await getClientIpHash()
  const ipLimit = rateLimit(`signin-ip:${ipHash}`, 20, 15 * 60_000)
  if (!ipLimit.ok) {
    return { error: 'Muitas tentativas. Aguarde alguns minutos.' }
  }

  const eKey = emailKey(parsed.data.email)
  const emailLimit = rateLimit(`signin-email:${eKey}`, 5, 15 * 60_000)
  if (!emailLimit.ok) {
    return { error: 'Muitas tentativas para este email. Aguarde 15 minutos ou redefina sua senha.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    if (error.message.toLowerCase().includes('not confirmed')) {
      return { error: 'Confirme seu email antes de entrar. Verifique sua caixa de entrada.' }
    }
    return { error: 'Email ou senha incorretos' }
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const parsed = resetSchema.safeParse({ email: formData.get('email') })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const email = parsed.data.email.toLowerCase().trim()

  const eKey = emailKey(email)
  const limit = rateLimit(`reset-email:${eKey}`, 3, 60 * 60_000)
  if (!limit.ok) {
    return { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' }
  }

  // Check if email exists in database
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (!existingUser) {
    return { error: 'Nenhuma conta encontrada com este email.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/update-password`,
  })

  if (error) {
    return { error: 'Erro ao enviar email de recuperação. Tente novamente.' }
  }

  return { success: 'Email de recuperação enviado! Verifique sua caixa de entrada.' }
}

export async function checkSlugAvailability(slug: string) {
  if (!slug || slug.length < 2) return { available: false }

  const existing = await prisma.user.findUnique({ where: { slug } })
  if (existing) return { available: false }

  const reserved = await prisma.$queryRaw<{ slug: string }[]>`
    SELECT slug FROM reserved_slugs WHERE slug = ${slug}
  `
  if (reserved.length > 0) return { available: false }

  return { available: true }
}

export async function exportMyData() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) return { error: 'Não autenticado' }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      links: {
        select: {
          id: true,
          title: true,
          url: true,
          icon: true,
          position: true,
          isActive: true,
          createdAt: true,
        },
      },
      subscription: {
        select: {
          status: true,
          stripePriceId: true,
          currentPeriodStart: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
          createdAt: true,
        },
      },
    },
  })

  if (!user) return { error: 'Usuário não encontrado' }

  const [pageViewCount, linkClickCount] = await Promise.all([
    prisma.pageView.count({ where: { userId: user.id } }),
    prisma.linkClick.count({ where: { userId: user.id } }),
  ])

  return {
    success: true,
    data: {
      exportedAt: new Date().toISOString(),
      account: {
        id: user.id,
        email: user.email,
        slug: user.slug,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        whatsapp: user.whatsapp,
        plan: user.plan,
        templateId: user.templateId,
        colorBg: user.colorBg,
        colorButton: user.colorButton,
        colorText: user.colorText,
        fontFamily: user.fontFamily,
        hideBranding: user.hideBranding,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      links: user.links,
      subscription: user.subscription,
      analyticsTotals: {
        pageViews: pageViewCount,
        linkClicks: linkClickCount,
      },
    },
  }
}

export async function deleteAccount(formData: FormData) {
  const password = formData.get('password')
  const confirm = formData.get('confirm')

  if (typeof password !== 'string' || password.length === 0) {
    return { error: 'Senha é obrigatória' }
  }
  if (confirm !== 'EXCLUIR') {
    return { error: 'Digite EXCLUIR para confirmar' }
  }

  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser?.email) return { error: 'Não autenticado' }

  // Re-autenticar com senha antes de operação irreversível
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: authUser.email,
    password,
  })
  if (reauthError) {
    return { error: 'Senha incorreta' }
  }

  // Cancelar assinatura Stripe imediatamente (se houver) — não bloquear se falhar
  const subscription = await prisma.subscription.findUnique({
    where: { userId: authUser.id },
    select: { stripeSubscriptionId: true, status: true },
  })
  if (subscription && subscription.status !== 'CANCELED') {
    try {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
    } catch {
      // Stripe pode falhar (sub já cancelada, fora de sync). Prosseguir.
    }
  }

  // public.users NÃO tem FK para auth.users — o vínculo é via trigger no INSERT.
  // Por isso deletamos primeiro o profile (que cascateia em links, page_views,
  // link_clicks e subscription) e depois o registro em auth.users.
  try {
    await prisma.user.delete({ where: { id: authUser.id } })
  } catch {
    // Já pode não existir (idempotência). Prosseguir.
  }

  const admin = createAdminClient()
  const { error: deleteError } = await admin.auth.admin.deleteUser(authUser.id)
  if (deleteError) {
    return { error: 'Falha ao excluir conta. Tente novamente.' }
  }

  await supabase.auth.signOut()
  redirect('/?deleted=1')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) return null

  // If Prisma throws (DB timeout, connection error), let it propagate so the
  // error boundary catches it instead of silently returning null → redirect loop.
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { subscription: true },
  })

  return dbUser
}
