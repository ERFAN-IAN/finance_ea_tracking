import { cookies } from "next/headers";
import { AccountList } from "@/components/AccountList";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const res = fetch("http://localhost:8000/api/accounts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  }).then(async (res) => {
    if (res.ok) return res.json();
    redirect("http://localhost:3000/api/");
  });
  return (
    <main className="p-6">
      <Suspense fallback={"loading ..."}>
        <AccountList accountsPromise={res} />
      </Suspense>
    </main>
  );
}
