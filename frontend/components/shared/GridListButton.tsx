"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";

export function GridListButton({
  isGrid,
  setIsGrid,
}: {
  isGrid: boolean;
  setIsGrid: (value: boolean) => void;
}) {
  return (
    <div className="hidden md:flex items-center gap-2 bg-muted p-1 rounded-xl">
      <Button
        size="icon"
        variant={isGrid ? "default" : "ghost"}
        className="h-8 w-8  cursor-pointer"
        onClick={() => {
          setIsGrid(true);
          localStorage.setItem("grid-preference", "true");
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
          localStorage.setItem("grid-preference", "false");
        }}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
