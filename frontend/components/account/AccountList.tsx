import { AccountCard } from "./AccountCard";
import { AccountSchema } from "@/schemas/account";
import { serverFetch } from "@/lib/fetch/server";
import { FetchError } from "../layout/FetchError";

export async function AccountList() {
  const response = await serverFetch(`accounts`, {
    next: {
      revalidate: 60,
    },
  });
  const { data, success } = AccountSchema.array().safeParse(
    await response.json()
  );
  if (success)
    return (
      <>
        {data.map((item) => (
          <AccountCard key={item.id} account={item} />
        ))}
      </>
    );
  return <FetchError message="Failed to load accounts." />;
}
