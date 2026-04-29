import { StatCardSkeleton, ChartSkeleton } from '@/components/ui/skeletons'

export default function AnalyticsLoading() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <div className="skeleton w-28 h-7 rounded-lg" />
        <div className="skeleton w-48 h-4 rounded-md" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <ChartSkeleton />
      <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
        <div className="skeleton w-40 h-5 rounded-md mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="skeleton w-32 h-4 rounded-md" />
                <div className="skeleton w-12 h-4 rounded-md" />
              </div>
              <div className="skeleton w-full h-1.5 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
