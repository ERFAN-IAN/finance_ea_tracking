import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AccountCard({
  account,
}: {
  account: { name: string; type: string; balance: number; is_active: boolean };
}) {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(account.balance);

  // 2. Define conditional styles
  const activeStyles = account.is_active
    ? "bg-emerald-50/50 border-emerald-200"
    : "bg-muted/30 border-muted";
  return (
    <Card
      className={cn("transition-colors duration-200 border-2", activeStyles)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{account.name}</CardTitle>

        {/* Status Badge */}
        <span
          className={cn(
            "px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full",
            account.is_active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-200 text-gray-600",
          )}
        >
          {account.is_active ? "Active" : "Inactive"}
        </span>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground capitalize">
            {account.type}
          </p>
          <p className="text-3xl font-bold tracking-tight">
            {formattedBalance}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
