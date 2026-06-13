"use server";

import { revalidatePath } from "next/cache";
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
  url?: string,
) => {
  const res = await serverFetch(`accounts${url ? `/${url}` : ""}`, {
    method,
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    return {
      success: false,
      error: await res.json(),
    };
  }

  if (method === "DELETE") {
    revalidatePath("/accounts");

    return {
      success: true,
    };
  }

  const result = AccountSchema.safeParse(await res.json());

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  revalidatePath("/accounts");

  return {
    success: true,
    data: result.data,
  };
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
    `${formData.id}`,
  );
}

export async function deleteAccount(formData: DeleteAccountFormData) {
  return await handleAccountActions(
    "DELETE",
    DeleteAccountSchema.parse(formData),
    `${formData.id}`,
  );
}
