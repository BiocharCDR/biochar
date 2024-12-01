export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 space-y-2">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-4 w-96 bg-muted rounded animate-pulse" />
      </div>

      {/* Summary Cards Loading */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 bg-card rounded-lg border space-y-2 animate-pulse"
          >
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Details Loading */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-6 bg-card rounded-lg border space-y-4 animate-pulse"
          >
            <div className="h-6 w-32 bg-muted rounded" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 w-full bg-muted rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
