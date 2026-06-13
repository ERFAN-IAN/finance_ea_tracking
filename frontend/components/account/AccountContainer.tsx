"use client";

import { use, useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AccountCard } from "@/components/account/AccountCard";
import { Account } from "@/types/account";
import { AccountSchema } from "@/schemas/account";
import { FetchError } from "@/components/layout/FetchError";

export function AccountContainer({
  accountPromise,
}: {
  accountPromise: Promise<Account[]>;
}) {
  const promiseData = use(accountPromise);
  const { data, success } = AccountSchema.array().safeParse(promiseData);
  const [isGrid, setIsGrid] = useState<boolean>();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsGrid(localStorage.getItem("grid") === "true");
    setIsMounted(true);
  }, []);

  if (!success) return <FetchError message="Something went wrong" />;
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
            {data.map((item) => (
              <div key={item.id} className="w-full">
                <AccountCard account={item} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    );
}
