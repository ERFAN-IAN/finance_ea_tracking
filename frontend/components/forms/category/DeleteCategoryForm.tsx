"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { setFormError } from "@/lib/formError";
import { Category, DeleteCategoryFormData } from "@/types/category";
import { DeleteCategorySchema } from "@/schemas/category";
import { deleteCategory } from "@/actions/category";

export function DeleteCategoryForm({
  category,
}: {
  category: DeleteCategoryFormData & Pick<Category, "name">;
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(DeleteCategorySchema),
    defaultValues: {
      id: category.id,
    },
  });

  async function onSubmit(data: DeleteCategoryFormData) {
    const res = await deleteCategory(data);
    if (!res.success) {
      setFormError(res, setError);
      return;
    }
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
      }}
    >
      <DialogTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent cursor-pointer">
        <Trash2 />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category "{category.name}"</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("id")} type="hidden" />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full"
            variant="destructive"
          >
            Delete
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
