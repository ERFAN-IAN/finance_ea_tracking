import { z } from "zod";

export const ACCOUNT_TYPES = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank" },
  { value: "card", label: "Card" },
  { value: "ewallet", label: "E-Wallet" },
  { value: "other", label: "Other" },
] as const;

export const AccountTypeSchema = z.enum(
  ACCOUNT_TYPES.map((t) => t.value) as [
    "cash",
    "bank",
    "card",
    "ewallet",
    "other"
  ]
);

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(1, "Name is required"),
  type: AccountTypeSchema,
  balance: z.number(),
  is_active: z.boolean(),
});

export const UpdateAccountSchema = AccountSchema.pick({
  id: true,
  name: true,
  type: true,
  balance: true,
}).extend({
  balance: z.coerce.number().min(0),
});

export const CreateAccountSchema = UpdateAccountSchema.pick({
  name: true,
  type: true,
  balance: true,
});
