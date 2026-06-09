"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { type CreateAccountFormData } from "@/components/forms/CreateAccountForm";
import { type UpdateAccountFormData } from "@/components/forms/UpdateAccountForm";

export async function createAccount(data: CreateAccountFormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(`${process.env.BACKEND_API_SERVER}accounts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    revalidatePath("/accounts");
    return true;
  }

  return false;
}

export async function updateAccount(data: UpdateAccountFormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.BACKEND_API_SERVER}accounts/${data.id}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (res.ok) {
    revalidatePath("/accounts");
    return true;
  }

  return false;
}
