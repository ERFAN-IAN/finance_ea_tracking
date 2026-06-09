"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
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
import { updateAccount } from "@/app/actions/accounts";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";

const ACCOUNT_TYPES = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank" },
  { value: "card", label: "Card" },
  { value: "ewallet", label: "E-Wallet" },
  { value: "other", label: "Other" },
] as const;
const UpdateAccountSchema = z.object({
  id: z.coerce.number(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(
    ACCOUNT_TYPES.map((t) => t.value) as [
      "cash",
      "bank",
      "card",
      "ewallet",
      "other"
    ]
  ),
  balance: z.coerce.number().min(0, "Balance cannot be negative"),
});

export type UpdateAccountFormData = z.infer<typeof UpdateAccountSchema>;

export function UpdateAccountForm({
  id,
  name,
  type,
  balance,
}: UpdateAccountFormData) {
  const [open, setOpen] = useState(false);

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
      <DialogTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-accent">
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
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(value) =>
                      ACCOUNT_TYPES.find((t) => t.value === value)?.label ??
                      "Select account type"
                    }
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {ACCOUNT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
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

          <Input placeholder="200" {...register("balance")} />
          {errors.balance && (
            <p className="text-sm text-red-500">{errors.balance.message}</p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
