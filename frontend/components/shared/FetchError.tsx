import { AlertTriangle } from "lucide-react";

export function FetchError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle className="mb-4 h-10 w-10 text-destructive" />

      <h3 className="text-lg font-semibold">Failed to load data</h3>

      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
