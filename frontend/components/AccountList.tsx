import { use } from "react";
import { AccountCard } from "./AccountCard";

export function AccountList({
  accountsPromise,
}: {
  accountsPromise: Promise<[]>;
}) {
  const accounts = use(accountsPromise);
  return (
    <>
      {accounts.map((item, index) => (
        <AccountCard key={index} account={item} />
      ))}
    </>
  );
}
