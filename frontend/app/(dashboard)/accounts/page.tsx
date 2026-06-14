import { AccountContainer } from "@/components/account/AccountContainer";
import { CreateAccountForm } from "@/components/forms/account/CreateAccountForm";
import { Suspense } from "react";
import { AccountContainerSkeleton } from "@/components/account/AccountContainerSkeleton";
import { serverFetch } from "@/lib/fetch/server";
import { Account } from "@/types/account";
import { PaginatedResponse } from "@/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const response: Promise<PaginatedResponse<Account> | { detail: string }> =
    serverFetch(`accounts?page=${page}`, {
      next: {
        revalidate: 60,
      },
    }).then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      const body = await res.json().catch(() => null);
      return {
        detail: body?.detail ?? "Request failed",
      };
    });

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
