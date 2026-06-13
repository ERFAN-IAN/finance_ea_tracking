import { cookies } from "next/headers";
export async function serverFetch(
  path: string,
  options: RequestInit = {},
  json = true,
) {
  const token = (await cookies()).get("access_token")?.value;

  return fetch(`${process.env.BACKEND_API_SERVER}${path}/`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      ...(json && {
        "Content-Type": "application/json",
      }),
    },
  });
}
