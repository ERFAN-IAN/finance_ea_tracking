"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ApiError, ApiResult, ApiSuccess, ApiSuccessVoid } from "@/types/index";

export async function serverFetch(
  path: string,
  options: RequestInit,
  schema?: never,
  json?: boolean,
): Promise<ApiSuccessVoid | ApiError>;
export async function serverFetch<T>(
  path: string,
  options: RequestInit,
  schema: z.ZodSchema<T>,
  json?: boolean,
): Promise<ApiSuccess<T> | ApiError>;
export async function serverFetch<T>(
  path: string,
  options: RequestInit = {},
  schema?: z.ZodSchema<T>,
  json: boolean = true,
): Promise<ApiResult<T>> {
  const cookieStore = await cookies();

  let csrftoken = cookieStore.get("csrftoken")?.value;

  if (!csrftoken) {
    return redirect("/login");
  }

  let response = await fetch(`${process.env.BACKEND_API_SERVER}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: cookieStore.toString(),
      "X-CSRFToken": csrftoken,
      ...(json && { "Content-Type": "application/json" }),
    },
  });

  if (response.status === 401 || response.status === 403) {
    return redirect("/login");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return { success: false, data: data, status: response.status };
  }

  if (schema) {
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
  return { success: true };
}
