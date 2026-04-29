import { LinkItemSkeleton } from '@/components/ui/skeletons'

export default function LinksLoading() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="space-y-2">
        <div className="skeleton w-24 h-7 rounded-lg" />
        <div className="skeleton w-16 h-4 rounded-md" />
      </div>
      <div className="skeleton w-full h-12 rounded-xl" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => <LinkItemSkeleton key={i} />)}
      </div>
    </div>
  )
}
