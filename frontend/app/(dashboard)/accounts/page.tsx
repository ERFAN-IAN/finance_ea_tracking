import { AccountContainer } from "@/components/account/AccountContainer";
import { CreateAccountForm } from "@/components/forms/account/CreateAccountForm";
import { Suspense } from "react";
import { AccountContainerSkeleton } from "@/components/account/AccountContainerSkeleton";
import { serverFetch } from "@/lib/fetch/server";
import { Account } from "@/types/account";

export default async function Page() {
  const response: Promise<Account[]> = serverFetch(`accounts`, {
    next: {
      revalidate: 60,
    },
  }).then((res) => res.json());
  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Accounts</h1>

        <CreateAccountForm />
      </div>

      <Suspense fallback={<AccountContainerSkeleton />}>
        <AccountContainer accountPromise={response} />
      </Suspense>
    </main>
  );
}
