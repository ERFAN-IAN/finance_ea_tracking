import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UpdateAccountForm } from "../../forms/account/UpdateAccountForm";
import { Account } from "@/types/account";
import { DeleteAccountForm } from "../../forms/account/DeleteAccountForm";

export function AccountCard({ account }: { account: Account }) {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IRR",
  }).format(account.balance);

  const isActive = account.is_active;

  const cardStyles = isActive
    ? "border-2 border-sky-200 bg-gradient-to-br from-sky-50/70 via-slate-50 to-white hover:border-sky-300"
    : "border-2 border-border bg-muted/40";

  const statusStyles = isActive
    ? "bg-sky-100 text-sky-800 ring-1 ring-sky-200"
    : "bg-slate-100 text-slate-600 ring-1 ring-slate-200";

  return (
    <Card
      className={cn(
        "transition-all duration-200 shadow-sm hover:shadow-md",
        cardStyles,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold tracking-tight">
          {account.name}
        </CardTitle>

        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] font-semibold rounded-full",
            statusStyles,
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isActive ? "bg-sky-500" : "bg-slate-400",
            )}
          />
          {isActive ? "Active" : "Inactive"}
        </span>
      </CardHeader>

      <CardContent className="flex justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            {account.type}
          </p>

          <p className="text-3xl font-semibold tracking-tight text-slate-900">
            {formattedBalance}
          </p>
        </div>
        <div className="flex gap-2">
          <UpdateAccountForm account={account} />
          <DeleteAccountForm account={account} />
        </div>
      </CardContent>
    </Card>
  );
}
