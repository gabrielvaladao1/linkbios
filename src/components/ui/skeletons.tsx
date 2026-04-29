export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-surface-border bg-surface-card">
      <div className="skeleton w-8 h-8 rounded-lg mb-2" />
      <div className="skeleton w-20 h-7 rounded-lg mb-2" />
      <div className="skeleton w-16 h-4 rounded-md" />
    </div>
  )
}

export function LinkItemSkeleton() {
  return (
    <div className="p-4 rounded-2xl border border-surface-border bg-surface-card flex items-center gap-3">
      <div className="flex flex-col gap-1 shrink-0">
        <div className="skeleton w-4 h-3 rounded" />
        <div className="skeleton w-4 h-3 rounded" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="skeleton w-40 h-4 rounded-md" />
        <div className="skeleton w-56 h-3 rounded-md" />
      </div>
      <div className="skeleton w-10 h-6 rounded-full" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
      <div className="skeleton w-48 h-5 rounded-md mb-6" />
      <div className="flex items-end gap-[2px] h-40">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 skeleton rounded-t"
            style={{ height: `${Math.random() * 60 + 15}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-2">
        <div className="skeleton w-56 h-7 rounded-lg" />
        <div className="skeleton w-40 h-4 rounded-md" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
          <div className="skeleton w-32 h-5 rounded-md mb-2" />
          <div className="skeleton w-48 h-3 rounded-md" />
        </div>
        <div className="p-6 rounded-2xl border border-surface-border bg-surface-card">
          <div className="skeleton w-36 h-5 rounded-md mb-2" />
          <div className="skeleton w-44 h-3 rounded-md" />
        </div>
      </div>
    </div>
  )
}
