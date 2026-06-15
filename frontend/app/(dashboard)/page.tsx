import { FetchError } from "@/components/layout/FetchError";
import { serverFetch } from "@/lib/fetch/server";
import { UserSchema } from "@/schemas/user";

export default async function Home() {
  const response = await serverFetch(
    "me/",
    {
      cache: "force-cache",
    },
    UserSchema,
  );

  return (
    <main className="p-6">
      {response.success ? (
        `Hello ${response.data.username}!`
      ) : (
        <FetchError message="Failed to load user!" />
      )}
    </main>
  );
}
