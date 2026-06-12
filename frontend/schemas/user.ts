import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  username: z.string().trim().min(1, "Name is required"),
  email: z.email().or(z.literal("")),
});
