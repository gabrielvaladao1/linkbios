import { getCurrentUser } from '@/actions/auth'
import { getSubscription } from '@/actions/billing'
import PlansPageClient from '@/components/dashboard/plans-page-client'

export default async function PlansPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const subscription = await getSubscription()

  return (
    <PlansPageClient
      currentPlan={user.plan}
      hasSubscription={!!subscription}
      cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? false}
    />
  )
}
