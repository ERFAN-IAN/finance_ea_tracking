"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { setFormError } from "@/lib/formError";
import { CreateCategoryFormData } from "@/types/category";
import { createCategory } from "@/actions/category";
import { CreateCategorySchema } from "@/schemas/category";

export function CreateCategoryForm() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(CreateCategorySchema),
  });

  async function onSubmit(data: CreateCategoryFormData) {
    const res = await createCategory(data);
    if (!res.success) {
      setFormError(res, setError);
      return;
    }

    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90  cursor-pointer">
        Add Category
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Category name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
