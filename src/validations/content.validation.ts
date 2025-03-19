import { z } from "zod";
import { ContentType } from "../models/content.model";

export const contentValidation = z.object({
  text: z
    .string()
    .min(5, "Text must be at least 5 characters long")
    .max(2000, "Text must not exceed 2000 characters"),
  link: z.string().url("Please enter a valid URL").optional(),
  type: z.nativeEnum(ContentType),
  tags: z.array(z.string()).optional(),
});

export const promptValidation = z.object({
  prompt: z.string(),
});
