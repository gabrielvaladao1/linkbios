import { getCurrentUser } from '@/actions/auth'
import { getSubscription } from '@/actions/billing'
import PlansPageClient from '@/components/dashboard/plans-page-client'

export default async function PlansPage() {
  const user = await getCurrentUser()
  if (!user) return null

  let subscription = null
  try {
    subscription = await getSubscription()
  } catch (err) {
    console.error('[PlansPage] getSubscription falhou:', err)
  }

  return (
    <PlansPageClient
      currentPlan={user.plan}
      hasSubscription={!!subscription}
      cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? false}
    />
  )
}
