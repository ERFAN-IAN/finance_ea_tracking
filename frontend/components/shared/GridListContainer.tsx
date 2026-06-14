"use client";

import { JSX, use, useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FetchError } from "@/components/shared/FetchError";
import { PaginatedResponse } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

export type DataGridContainerProps<T extends z.ZodSchema<{ id: number }>> = {
  promise: Promise<PaginatedResponse<unknown> | { detail: string }>;
  schema: T;
  renderItem: (item: z.infer<T>) => JSX.Element;
  emptyMessage?: string;
};

export function GridListContainer<T extends z.ZodSchema<{ id: number }>>({
  promise,
  schema,
  renderItem,
  emptyMessage = "No items found.",
}: DataGridContainerProps<T>) {
  const promiseData = use(promise);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isGrid, setIsGrid] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsGrid(localStorage.getItem("grid") === "true");
    setIsMounted(true);
  }, []);

  if ("detail" in promiseData) {
    return <FetchError message={promiseData.detail} />;
  }

  const { data, success } = schema.array().safeParse(promiseData.results);
  if (!success) return <FetchError message={`Something went wrong`} />;

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = 10;
  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    const biggestPage = Math.ceil(promiseData.count / pageSize);
    params.set("page", String(Math.min(Math.max(newPage, 1), biggestPage)));
    router.push(`?${params.toString()}`);
  };

  if (promiseData.count === 0)
    return (
      <div className="py-10 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );

  if (!isMounted)
    return <div className="min-h-100 animate-pulse bg-muted/10 rounded-lg" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl">
          <Button
            size="icon"
            variant={isGrid ? "default" : "ghost"}
            className="h-8 w-8  cursor-pointer"
            onClick={() => {
              setIsGrid(true);
              localStorage.setItem("grid", "true");
            }}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={!isGrid ? "default" : "ghost"}
            className="h-8 w-8  cursor-pointer"
            onClick={() => {
              setIsGrid(false);
              localStorage.setItem("grid", "false");
            }}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={isGrid ? "grid" : "list"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`grid gap-4 ${
            isGrid ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {data.map((item) => (
            <div key={item.id} className="w-full">
              {renderItem(item)}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      <Pagination>
        <PaginationContent>
          {promiseData.previous && (
            <PaginationItem>
              <PaginationPrevious onClick={() => goToPage(page - 1)} />
            </PaginationItem>
          )}
          {promiseData.next && (
            <PaginationItem>
              <PaginationNext onClick={() => goToPage(page + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
