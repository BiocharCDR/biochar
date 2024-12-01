export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 space-y-2">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="h-4 w-96 bg-muted rounded animate-pulse" />
      </div>

      <div className="space-y-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-lg">
            <div className="p-6 space-y-4">
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-full bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-10 w-full bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
