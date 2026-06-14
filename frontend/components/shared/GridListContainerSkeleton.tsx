import { Skeleton } from "@/components/ui/skeleton";

export function GridListContainerSkeleton({
  isGrid = true,
  count = 6,
  SkeletonItem,
}: {
  isGrid?: boolean;
  count?: number;
  SkeletonItem: React.ComponentType;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      <div
        className={`grid gap-4 ${
          isGrid ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-full">
            <SkeletonItem />
          </div>
        ))}
      </div>
    </div>
  );
}
