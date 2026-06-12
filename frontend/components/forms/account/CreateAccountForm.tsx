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
import { createAccount } from "@/actions/accounts";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAccountFormData } from "@/types/account";
import { CreateAccountSchema, ACCOUNT_TYPES } from "@/schemas/account";

export function CreateAccountForm() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    reset,
  } = useForm({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      name: "",
      type: "cash",
      balance: 0,
    },
  });

  async function onSubmit(data: CreateAccountFormData) {
    const res = await createAccount(data);

    if (!res.success) return;

    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Add Account
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
