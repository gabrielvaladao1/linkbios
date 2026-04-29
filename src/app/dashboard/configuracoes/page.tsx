import { getCurrentUser } from '@/actions/auth'
import SettingsPageClient from '@/components/dashboard/settings-page'
import PixelConfig from '@/components/dashboard/pixel-config'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  return (
    <div className="animate-fade-in space-y-8">
      <SettingsPageClient user={user} />
      <PixelConfig
        metaPixelId={user.metaPixelId ?? null}
        tiktokPixelId={user.tiktokPixelId ?? null}
        plan={user.plan}
      />
    </div>
  )
}
