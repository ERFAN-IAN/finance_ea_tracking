import { z } from "zod";

import {
  AccountSchema,
  CreateAccountSchema,
  DeleteAccountSchema,
  UpdateAccountSchema,
} from "@/schemas/account";

export type Account = z.infer<typeof AccountSchema>;

export type UpdateAccountFormData = z.infer<typeof UpdateAccountSchema>;

export type CreateAccountFormData = z.infer<typeof CreateAccountSchema>;

export type DeleteAccountFormData = z.infer<typeof DeleteAccountSchema>;
