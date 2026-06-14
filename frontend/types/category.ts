import { z } from "zod";

import { CategorySchema } from "@/schemas/category";

export type Category = z.infer<typeof CategorySchema>;
