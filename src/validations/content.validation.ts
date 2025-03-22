import { z } from "zod";
import { ContentType } from "../models/content.model";

export const contentValidation = z.object({
  text: z
    .string()
    .min(5, "Text must be at least 5 characters long")
    .max(2000, "Text must not exceed 2000 characters"),
  link: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === "" ||
        z.string().url().safeParse(val).success,
      {
        message: "Please enter a valid URL",
      }
    ),
  type: z.nativeEnum(ContentType),
  tags: z.array(z.string()).optional().default([]),
});

export const promptValidation = z.object({
  prompt: z.string(),
});
