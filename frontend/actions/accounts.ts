"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  type UpdateAccountFormData,
  type CreateAccountFormData,
  DeleteAccountFormData,
} from "@/types/account";
import { AccountSchema } from "@/schemas/account";
import { serverFetch } from "@/lib/fetch/server";
import {
  CreateAccountSchema,
  UpdateAccountSchema,
  DeleteAccountSchema,
} from "@/schemas/account";

const handleAccountActions = async (
  method: "POST" | "PATCH" | "DELETE",
  formData:
    | CreateAccountFormData
    | UpdateAccountFormData
    | DeleteAccountFormData,
  schema: z.ZodSchema = AccountSchema,
  url?: string,
) => {
  const res = await serverFetch(
    `accounts${url ? `/${url}` : ""}/`,
    {
      method,
      body: JSON.stringify(formData),
    },
    schema,
  );

  if (!res.success) {
    const body = res.data as any;

    // Map DRF errors to a stable shape
    const fieldErrors: Record<string, string[]> = {};
    let formError: string | undefined;

    if (body && typeof body === "object") {
      for (const [key, value] of Object.entries(body)) {
        if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
          if (key === "non_field_errors" || key === "detail") {
            formError = value.join(" ");
          } else {
            fieldErrors[key] = value as string[];
          }
        } else if (key === "detail" && typeof value === "string") {
          formError = value;
        }
      }
    }

    return {
      success: false,
      fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
      formError,
    } as const;
  }
  revalidatePath("/accounts");
  return { success: true, data: res.data } as const;
};

export async function createAccount(formData: CreateAccountFormData) {
  return await handleAccountActions(
    "POST",
    CreateAccountSchema.parse(formData),
  );
}

export async function updateAccount(formData: UpdateAccountFormData) {
  return await handleAccountActions(
    "PATCH",
    UpdateAccountSchema.parse(formData),
    undefined,
    `${formData.id}`,
  );
}

export async function deleteAccount(formData: DeleteAccountFormData) {
  return await handleAccountActions(
    "DELETE",
    DeleteAccountSchema.parse(formData),
    z.void(),
    `${formData.id}`,
  );
}
