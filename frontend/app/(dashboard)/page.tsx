import { FetchError } from "@/components/layout/FetchError";
import { serverFetch } from "@/lib/fetch/server";
import { UserSchema } from "@/schemas/user";

export default async function Home() {
  const response = await serverFetch("me/", {
    cache: "force-cache",
  });
  const { data, success, error } = UserSchema.safeParse(await response.json());

  return (
    <main className="p-6">
      {success ? (
        `Hello ${data.username}!`
      ) : (
        <FetchError message="Failed to load user!" />
      )}
    </main>
  );
}
