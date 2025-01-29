import { z } from "zod";

const contentValidation = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long.")
    .max(100, "Title must not exceed 100 characters."),
  link: z.string().url("Please enter a valid URL.").optional(),
  description: z
    .string()
    .max(200, "Description must not exceed 200 characters.")
    .optional(),
  type: z.enum(["todo", "tweet", "image", "video", "audio", "article"]),
  tags: z.array(z.string()).optional(),
});

export default contentValidation;
