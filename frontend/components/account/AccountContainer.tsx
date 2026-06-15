"use client";

import { use, useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AccountCard } from "@/components/account/AccountCard";
import { Account } from "@/types/account";
import { FetchError } from "@/components/layout/FetchError";
import { PaginatedResponse } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiResult } from "@/lib/fetch/server";

export function AccountContainer({
  accountPromise,
}: {
  accountPromise: Promise<ApiResult<PaginatedResponse<Account>>>;
}) {
  const promiseData = use(accountPromise);
  if (!promiseData.success) {
    if (
      typeof promiseData.data === "object" &&
      promiseData.data !== null &&
      "detail" in promiseData.data &&
      typeof promiseData.data.detail === "string"
    ) {
      return <FetchError message={promiseData.data?.detail} />;
    }
    return <FetchError message="Something went wrong!" />;
  }

  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = 10;

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    const biggestPage = Math.ceil(promiseData.data.count / pageSize);

    params.set("page", String(Math.min(Math.max(newPage, 1), biggestPage)));

    router.push(`?${params.toString()}`);
  };

  const [isGrid, setIsGrid] = useState<boolean>();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsGrid(localStorage.getItem("grid") === "true");
    setIsMounted(true);
  }, []);
  if (promiseData.data.count === 0) return <p>No accounts yet</p>;
  if (isMounted)
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
            {promiseData.data.results.map((item) => (
              <div key={item.id} className="w-full">
                <AccountCard account={item} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        <Pagination>
          <PaginationContent>
            {promiseData.data.previous && (
              <PaginationItem>
                <PaginationPrevious onClick={() => goToPage(page - 1)} />
              </PaginationItem>
            )}
            {promiseData.data.next && (
              <PaginationItem>
                <PaginationNext onClick={() => goToPage(page + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    );
}
