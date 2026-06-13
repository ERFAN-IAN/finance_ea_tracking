"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateAccount } from "@/actions/accounts";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { UpdateAccountFormData } from "@/types/account";
import { UpdateAccountSchema, ACCOUNT_TYPES } from "@/schemas/account";

export function UpdateAccountForm({
  account,
}: {
  account: UpdateAccountFormData;
}) {
  const [open, setOpen] = useState(false);
  const { id, name, type, balance } = account;
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({
    resolver: zodResolver(UpdateAccountSchema),
    defaultValues: {
      id: id,
      name: name,
      type: type,
      balance: balance,
    },
  });

  async function onSubmit(data: UpdateAccountFormData) {
    const res = await updateAccount(data);

    if (!res) return;

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
            type,
            balance,
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
          <DialogTitle>Update Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("id")} type="hidden" />
          <Input placeholder="Account name" {...register("name")} />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
          <label className=" text-xs" htmlFor="type">
            Type
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                id="type"
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue>
                    {(value) =>
                      ACCOUNT_TYPES.find((t) => t.value === value)?.label ??
                      "Select account type"
                    }
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {ACCOUNT_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="cursor-pointer"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
          <label className=" text-xs" htmlFor="balance">
            Balance
          </label>
          <Input placeholder="200" id="balance" {...register("balance")} />
          {errors.balance && (
            <p className="text-sm text-red-500">{errors.balance.message}</p>
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
