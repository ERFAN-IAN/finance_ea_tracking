"use client";

import { use, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AccountCard } from "@/components/sections/account/AccountCard";
import { Account } from "@/types/account";
import { FetchError } from "@/components/shared/FetchError";
import { PaginatedResponse } from "@/types";
import { ApiError, ApiSuccess } from "@/types";
import { CustomPagination } from "./CustomPagination";
import { GridListButton } from "./GridListButton";
import { Wallet } from "lucide-react";
import { NoItem } from "./NoItem";
import { hasDetail } from "@/lib/typeguards";

type Cards = {
  account: Account;
};

export function GridListContainer<T extends keyof Cards>({
  promise,
  cardType,
}: {
  promise: Promise<ApiSuccess<PaginatedResponse<Cards[T]>> | ApiError>;
  cardType: T;
}) {
  const usedPromise = use(promise);
  if (!usedPromise.success) {
    return (
      <FetchError
        message={
          hasDetail(usedPromise.data)
            ? usedPromise.data.detail
            : "Something went wrong!"
        }
      />
    );
  }

  const [isGrid, setIsGrid] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    const gridStaut =
      localStorage.getItem("grid-preference") === "true" ||
      localStorage.getItem("grid-preference") === null;
    console.log(localStorage.getItem("grid-preference"));
    setIsGrid(gridStaut);
    setIsMounted(true);
  }, []);
  if (usedPromise.data.count === 0)
    return <NoItem value="account" Icon={Wallet} />;
  if (isMounted)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <GridListButton isGrid={isGrid} setIsGrid={setIsGrid} />
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
            {usedPromise.data.results.map((item) => (
              <div key={item.id} className="w-full">
                {cardType === "account" && (
                  <AccountCard account={item as Account} />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        <CustomPagination
          prev={usedPromise.data.previous}
          next={usedPromise.data.next}
          count={usedPromise.data.count}
        />
      </div>
    );
}
