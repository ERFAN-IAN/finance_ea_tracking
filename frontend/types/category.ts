import { z } from "zod";

import {
  CategorySchema,
  CreateCategorySchema,
  DeleteCategorySchema,
} from "@/schemas/category";

export type Category = z.infer<typeof CategorySchema>;

export type CreateCategoryFormData = z.infer<typeof CreateCategorySchema>;

export type UpdateCategoryFormData = z.infer<typeof CategorySchema>;

export type DeleteCategoryFormData = z.infer<typeof DeleteCategorySchema>;
