export async function clientFetch(
  path: string,
  options: RequestInit = {},
  json = true
) {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers ?? {}),
      ...(json ? { "Content-Type": "application/json" } : {}),
    },
  });
}
