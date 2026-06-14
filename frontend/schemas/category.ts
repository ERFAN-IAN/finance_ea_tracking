import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string().trim().min(1, "Name is required"),
});
