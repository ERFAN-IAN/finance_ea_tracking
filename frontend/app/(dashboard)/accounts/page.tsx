import { AccountContainer } from "@/components/account/AccountContainer";
import { CreateAccountForm } from "@/components/forms/account/CreateAccountForm";
import { Suspense } from "react";
import { AccountContainerSkeleton } from "@/components/account/AccountContainerSkeleton";
import { serverFetch } from "@/lib/fetch/server";
import { PaginatedResponseSchema } from "@/schemas";
import { AccountSchema } from "@/schemas/account";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const response = serverFetch(
    `accounts?page=${page}`,
    {
      next: {
        revalidate: 60,
      },
    },
    PaginatedResponseSchema(AccountSchema),
  );

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
