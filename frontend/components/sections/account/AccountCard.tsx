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
    ? `
      border-sky-500/30
      bg-gradient-to-br
      from-sky-500/5
      via-background
      to-background
      hover:border-sky-500/50
    `
    : `
      border-border
      bg-muted/30
    `;

  const statusStyles = isActive
    ? `
      bg-sky-500/10
      text-sky-600
      dark:text-sky-400
      ring-sky-500/20
    `
    : `
      bg-muted
      text-muted-foreground
      ring-border
    `;

  return (
    <Card
      className={cn(
        `
    transition-all
    duration-300
    hover:shadow-lg
    `,
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
              isActive
                ? "bg-sky-500 shadow-[0_0_8px_var(--color-sky-500)]"
                : "bg-muted-foreground",
            )}
          />
          {isActive ? "Active" : "Inactive"}
        </span>
      </CardHeader>

      <CardContent className="flex justify-between items-end gap-4">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {account.type}
          </p>

          <p className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
            {formattedBalance}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <UpdateAccountForm account={account} />
          <DeleteAccountForm account={account} />
        </div>
      </CardContent>
    </Card>
  );
}
