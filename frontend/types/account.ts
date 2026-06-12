import { z } from "zod";

import {
  AccountSchema,
  CreateAccountSchema,
  UpdateAccountSchema,
} from "@/schemas/account";

export type Account = z.infer<typeof AccountSchema>;

export type UpdateAccountFormData = z.infer<typeof UpdateAccountSchema>;

export type CreateAccountFormData = z.infer<typeof CreateAccountSchema>;
