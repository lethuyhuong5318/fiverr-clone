export const JobCardSkeleton = ({ count = 8 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="overflow-hidden rounded-lg border border-gray-200">
        <div className="aspect-[4/3] animate-pulse bg-gray-200" />
        <div className="space-y-2 p-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    ))}
  </>
);
