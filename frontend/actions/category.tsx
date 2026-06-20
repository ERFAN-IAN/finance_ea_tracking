"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DeleteAccountFormData } from "@/types/account";
import { serverFetch } from "@/lib/fetch/server";
import { parseFormError } from "@/lib/formError";
import {
  CategorySchema,
  CreateCategorySchema,
  DeleteCategorySchema,
} from "@/schemas/category";
import {
  Category,
  CreateCategoryFormData,
  DeleteCategoryFormData,
} from "@/types/category";

async function handleCategoryActions<T>(
  method: "POST" | "PATCH" | "DELETE",
  formData: CreateCategoryFormData | Category | DeleteAccountFormData,
  schema?: z.ZodSchema<T>,
  url?: string,
) {
  if (schema) {
    const res = await serverFetch(
      `categories${url ? `/${url}` : ""}/`,
      {
        method,
        body: JSON.stringify(formData),
      },
      schema,
    );

    if (!res.success) {
      return parseFormError(res.data);
    }

    revalidatePath("/categories");
    return { success: true, data: res.data } as const;
  }

  const res = await serverFetch(`categories${url ? `/${url}` : ""}/`, {
    method,
    body: JSON.stringify(formData),
  });

  if (!res.success) {
    return parseFormError(res.data);
  }

  revalidatePath("/categories");
  return { success: res.success };
}

export async function createCategory(formData: CreateCategoryFormData) {
  return await handleCategoryActions(
    "POST",
    CreateCategorySchema.parse(formData),
    CategorySchema,
  );
}

export async function updateCategory(formData: Category) {
  return await handleCategoryActions(
    "PATCH",
    CategorySchema.parse(formData),
    CategorySchema,
    `${formData.id}`,
  );
}

export async function deleteCategory(formData: DeleteCategoryFormData) {
  return await handleCategoryActions(
    "DELETE",
    DeleteCategorySchema.parse(formData),
    undefined,
    `${formData.id}`,
  );
}
