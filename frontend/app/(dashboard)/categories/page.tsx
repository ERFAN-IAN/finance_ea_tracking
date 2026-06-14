import { CreateAccountForm } from "@/components/forms/account/CreateAccountForm";
import { Suspense } from "react";
import { serverFetch } from "@/lib/fetch/server";
import { PaginatedResponse } from "@/types";
import { GridListContainer } from "@/components/shared/GridListContainer";
import { Category } from "@/types/category";
import { CategorySchema } from "@/schemas/category";
import { CategoryCard } from "@/components/sections/category/CategoryCard";
import { CategoryCardSkeleton } from "@/components/sections/category/CategoryCardSkeleton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const response: Promise<PaginatedResponse<Category> | { detail: string }> =
    serverFetch(`categories?page=${page}`, {
      next: {
        revalidate: 60,
      },
    }).then(async (res) => {
      if (res.ok) {
        return res.json();
      }
      const body = await res.json().catch(() => null);
      return {
        detail: body?.detail ?? "Request failed",
      };
    });

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>

        <CreateAccountForm />
      </div>

      <Suspense fallback={<CategoryCardSkeleton />}>
        <GridListContainer
          promise={response}
          schema={CategorySchema}
          emptyMessage="No Categories found."
          renderItem={(category) => <CategoryCard category={category} />}
        />
      </Suspense>
    </main>
  );
}
