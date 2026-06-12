import { AccountCardSkeleton } from "./AccountCardSkeleton";

export function AccountListSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <AccountCardSkeleton key={i} />
      ))}
    </div>
  );
}
