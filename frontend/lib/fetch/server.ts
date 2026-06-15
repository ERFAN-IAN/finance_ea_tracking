"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; data: unknown; status: number };

export async function serverFetch<T>(
  path: string,
  options: RequestInit = {},
  schema: z.ZodSchema<T>,
  json = true,
): Promise<ApiResult<T>> {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken) {
    if (!refreshToken) redirect("/login");
    accessToken = await refreshAccessToken(refreshToken);
  }

  const doFetch = async () => {
    return await fetch(`${process.env.BACKEND_API_SERVER}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        ...(json && { "Content-Type": "application/json" }),
      },
      cache: "no-store",
    });
  };

  let response = await doFetch();

  if (response.status === 401 && refreshToken) {
    accessToken = await refreshAccessToken(refreshToken);
    response = await doFetch();
  }

  if (response.status === 204) {
    return { success: true, data: undefined as unknown as T };
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return { success: false, data: data, status: response.status };
  }

  // 4. Validate success data
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    console.error("Zod Validation Failed:", parsed.error);
    return {
      success: false,
      data: { message: "Invalid API response format" },
      status: 500,
    };
  }

  return { success: true, data: parsed.data };
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const cookieStore = await cookies();

  const refreshRes = await fetch(
    `${process.env.BACKEND_API_SERVER}token/refresh/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: "no-store",
    },
  );

  if (!refreshRes.ok) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    redirect("/login");
  }

  const data = await refreshRes.json();
  const newAccessToken = data.access;

  if (!process.env.ACCESS_TOKEN_LIFETIME_MINUTES) {
    throw new Error("ACCESS_TOKEN_LIFETIME_MINUTES not set!");
  }

  cookieStore.set("access_token", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: parseInt(process.env.ACCESS_TOKEN_LIFETIME_MINUTES, 10) * 60,
  });

  return newAccessToken;
}
