import { getCurrentUser } from '@/actions/auth'
import { prisma } from '@/lib/prisma'
import AppearancePageClient from '@/components/editor/appearance-editor'

export default async function AppearancePage() {
  const user = await getCurrentUser()
  if (!user) return null

  const socialLinks = (user.socialLinks as { platform: string; url: string }[]) || []

  // Fetch links for the preview
  const links = await prisma.link.findMany({
    where: { userId: user.id, isActive: true },
    orderBy: { position: 'asc' },
    select: { id: true, title: true, url: true },
  })

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Aparência</h1>
        <p className="text-zinc-400 text-sm mt-1">Personalize sua página</p>
      </div>

      {/* Everything inside one component so the grid + sticky preview spans the full page */}
      <AppearancePageClient
        user={{
          ...user,
          socialLinks,
          buttonStyle: user.buttonStyle as 'solid' | 'glass' | 'outline',
          buttonRoundness: user.buttonRoundness as 'square' | 'round' | 'rounder' | 'full',
          buttonShadow: user.buttonShadow as 'none' | 'soft' | 'strong' | 'hard',
          headerLayout: user.headerLayout as 'classic' | 'hero',
          leadsEnabled: user.leadsEnabled,
          leadsHeading: user.leadsHeading,
          leadsButton: user.leadsButton,
        }}
        links={links}
      />
    </div>
  )
}
