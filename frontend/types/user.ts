import { z } from "zod";

import { UserSchema } from "@/schemas/user";

export type user = z.infer<typeof UserSchema>;
