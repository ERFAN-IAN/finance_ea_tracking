import { GridListContainer } from "@/components/shared/GridListContainer";
import { Suspense } from "react";
import { serverFetch } from "@/lib/fetch/server";
import { PaginatedResponseSchema } from "@/schemas";
import { GridListContainerSkeleton } from "@/components/shared/GridListSkeleton";
import { CategorySchema } from "@/schemas/category";
import { CategoryCardSkeleton } from "@/components/sections/category/CategoryCardSkeleton";
import { CreateCategoryForm } from "@/components/forms/category/CreateCategoryForm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const response = serverFetch(
    `categories/?page=${page}`,
    {
      next: {
        revalidate: 60,
      },
    },
    PaginatedResponseSchema(CategorySchema),
  );

  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>

        <CreateCategoryForm />
      </div>

      <Suspense
        fallback={
          <GridListContainerSkeleton CardSkeleton={<CategoryCardSkeleton />} />
        }
      >
        <GridListContainer
          promise={response}
          cardType="category"
          gridCSSOpenSidebar="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          gridCSSCloseSidebar="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        />
      </Suspense>
    </main>
  );
}
