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
import { SquarePen } from "lucide-react";
import { setFormError } from "@/lib/formError";
import { CategorySchema } from "@/schemas/category";
import { UpdateCategoryFormData } from "@/types/category";
import { updateCategory } from "@/actions/category";

export function UpdateCategoryForm({
  category,
}: {
  category: UpdateCategoryFormData;
}) {
  const [open, setOpen] = useState(false);
  const { id, name } = category;
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      id: id,
      name: name,
    },
  });

  async function onSubmit(data: UpdateCategoryFormData) {
    const res = await updateCategory(data);

    if (!res.success) {
      setFormError(res, setError);
      return;
    }
    reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (newOpen) {
          reset({
            id,
            name,
          });
        }

        setOpen(newOpen);
      }}
    >
      <DialogTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-accent cursor-pointer">
        <SquarePen className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("id")} type="hidden" />
          <Input placeholder="Category name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
