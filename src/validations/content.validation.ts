import { z } from "zod";
import { ContentType } from "../models/content.model";

export const contentValidation = z.object({
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .max(2000, "Description must not exceed 2000 characters"),
  link: z.string().url("Please enter a valid URL").optional(),
  type: z.nativeEnum(ContentType),
  tags: z.array(z.string()).optional(),
});
