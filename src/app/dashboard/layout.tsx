import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { ToastProvider } from '@/components/ui/toast'
import { prisma } from '@/lib/prisma'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) {
    // If there's a Supabase session but no Prisma profile, sign out to break
    // the redirect loop (middleware sees session → /dashboard, layout sees no
    // profile → /login, repeat). signOut() clears the session cookie first.
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      // Auth user exists but Prisma profile missing — clear session
      await supabase.auth.signOut()
    }
    redirect('/login')
  }

  // Calculate setup progress for sidebar badge
  const linkCount = await prisma.link.count({ where: { userId: user.id } })
  const socialLinks = (user.socialLinks as { platform: string; url: string }[]) || []

  const setupSteps = [
    linkCount > 0,              // has links
    !!user.avatarUrl,           // has avatar
    user.templateId !== 'minimal', // customized template
    socialLinks.length > 0,     // has social links
    true,                       // shared (always true for sidebar — checked more accurately in dashboard)
  ]
  const setupProgress = {
    completed: setupSteps.filter(Boolean).length,
    total: setupSteps.length,
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface flex">
        <DashboardSidebar user={user} setupProgress={setupProgress} />
        <main className="flex-1 lg:ml-64">
          {/* Mobile top padding for hamburger header */}
          <div className="pt-14 lg:pt-0" />
          <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 lg:pb-8">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}
