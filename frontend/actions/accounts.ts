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
import { parseFormError } from "@/lib/formError";

async function handleAccountActions<T>(
  method: "POST" | "PATCH" | "DELETE",
  formData:
    | CreateAccountFormData
    | UpdateAccountFormData
    | DeleteAccountFormData,
  schema?: z.ZodSchema<T>,
  url?: string,
) {
  if (schema) {
    const res = await serverFetch(
      `accounts${url ? `/${url}` : ""}/`,
      {
        method,
        body: JSON.stringify(formData),
      },
      schema,
    );

    if (!res.success) {
      return parseFormError(res.data);
    }

    revalidatePath("/accounts");
    return { success: true, data: res.data } as const;
  }

  const res = await serverFetch(`accounts${url ? `/${url}` : ""}/`, {
    method,
    body: JSON.stringify(formData),
  });

  if (!res.success) {
    return parseFormError(res.data);
  }

  revalidatePath("/accounts");
  return { success: res.success };
}

export async function createAccount(formData: CreateAccountFormData) {
  return await handleAccountActions(
    "POST",
    CreateAccountSchema.parse(formData),
    AccountSchema,
  );
}

export async function updateAccount(formData: UpdateAccountFormData) {
  return await handleAccountActions(
    "PATCH",
    UpdateAccountSchema.parse(formData),
    AccountSchema,
    `${formData.id}`,
  );
}

export async function deleteAccount(formData: DeleteAccountFormData) {
  return await handleAccountActions(
    "DELETE",
    DeleteAccountSchema.parse(formData),
    undefined,
    `${formData.id}`,
  );
}
