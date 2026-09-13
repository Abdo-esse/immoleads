export default function LeadsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-7 w-24 rounded-lg bg-muted" />
          <div className="mt-2 h-4 w-48 rounded-lg bg-muted" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-muted" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-muted" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border bg-card">
        {/* Table header */}
        <div className="grid grid-cols-5 gap-4 border-b p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 rounded bg-muted" />
          ))}
        </div>

        {/* Table rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 border-b p-4 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
            </div>
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-5 w-16 rounded-full bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
