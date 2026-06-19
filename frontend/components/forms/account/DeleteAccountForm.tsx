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
import { deleteAccount } from "@/actions/accounts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { Account, DeleteAccountFormData } from "@/types/account";
import { DeleteAccountSchema } from "@/schemas/account";
import { setFormError } from "@/lib/formError";

export function DeleteAccountForm({
  account,
}: {
  account: DeleteAccountFormData & Pick<Account, "name">;
}) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      id: account.id,
    },
  });

  async function onSubmit(data: DeleteAccountFormData) {
    const res = await deleteAccount(data);
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
          <DialogTitle>Delete Account "{account.name}"</DialogTitle>
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
