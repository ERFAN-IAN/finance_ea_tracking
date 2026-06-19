"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

export function CustomPagination({
  prev,
  next,
  pageSize = 10,
  count,
}: {
  prev: string | null;
  next: string | null;
  pageSize?: number;
  count: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    const biggestPage = Math.ceil(count / pageSize);

    params.set("page", String(Math.min(Math.max(newPage, 1), biggestPage)));

    router.push(`?${params.toString()}`);
  };
  return (
    <Pagination>
      <PaginationContent>
        {prev && (
          <PaginationItem>
            <PaginationPrevious onClick={() => goToPage(page - 1)} />
          </PaginationItem>
        )}
        {next && (
          <PaginationItem>
            <PaginationNext onClick={() => goToPage(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
