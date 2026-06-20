import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCardSkeleton() {
  return (
    <Card className="border-2 border-muted">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="flex justify-end gap-2">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </CardContent>
    </Card>
  );
}
