import { AccountList } from "@/components/account/AccountList";
import { CreateAccountForm } from "@/components/forms/account/CreateAccountForm";
import { Suspense } from "react";
import { Account } from "@/types/account";
import { AccountListSkeleton } from "@/components/account/AccountListSkeleton";

export default async function Page() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Accounts</h1>

        <CreateAccountForm />
      </div>

      <Suspense fallback={<AccountListSkeleton />}>
        <AccountList />
      </Suspense>
    </main>
  );
}
