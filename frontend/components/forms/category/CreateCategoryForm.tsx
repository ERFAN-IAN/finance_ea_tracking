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
import { createAccount } from "@/actions/accounts";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAccountFormData } from "@/types/account";
import { CreateAccountSchema, ACCOUNT_TYPES } from "@/schemas/account";
import { BaseDialogForm } from "../BaseDialogForm";

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
      balance: 0,
    },
  });

  async function onSubmit(data: CreateAccountFormData) {
    const res = await createAccount(data);

    if (!res.success) return;

    reset();
    setOpen(false);
  }

  const form = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            value={field.value || ""}
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

      <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
        Create
      </Button>
    </form>
  );
  return <BaseDialogForm form={form} title="Add Accunt" />;
}
