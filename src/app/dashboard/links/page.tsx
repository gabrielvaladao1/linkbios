import { getLinks } from '@/actions/links'
import { LinkEditor } from '@/components/editor/link-editor'
import { getCurrentUser } from '@/actions/auth'
import { PLANS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export default async function LinksPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const links = await getLinks()
  const plan = PLANS[user.plan]

  // Fetch click counts per link (lightweight groupBy)
  const clickCounts = await prisma.linkClick.groupBy({
    by: ['linkId'],
    where: { userId: user.id },
    _count: { id: true },
  })

  const clickMap: Record<string, number> = {}
  clickCounts.forEach(c => {
    clickMap[c.linkId] = c._count.id
  })

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Links</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {links.length}{plan.limits.maxLinks < Infinity ? `/${plan.limits.maxLinks}` : ''} links
          </p>
        </div>
      </div>

      <LinkEditor links={links} clickCounts={clickMap} />
    </div>
  )
}
