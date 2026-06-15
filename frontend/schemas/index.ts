import { z } from "zod";

export const PaginatedResponseSchema = <T extends z.ZodSchema>(itemSchema: T) =>
  z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });
