import { cookies } from "next/headers";
import { AccountList } from "@/components/AccountList";
import { CreateAccountForm } from "@/components/forms/CreateAccountForm";
import { Suspense } from "react";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const res = fetch(`${process.env.BACKEND_API_SERVER}accounts/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  }).then(async (res) => {
    if (res.ok) return res.json();
  });
  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Accounts</h1>

        <CreateAccountForm />
      </div>

      <Suspense fallback="loading ...">
        <AccountList accountsPromise={res} />
      </Suspense>
    </main>
  );
}
