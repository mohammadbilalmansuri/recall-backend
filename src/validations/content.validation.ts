import { z } from "zod";

const contentValidation = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long.")
    .max(100, "Title must not exceed 100 characters."),
  description: z
    .string()
    .max(200, "Description must not exceed 200 characters.")
    .optional(),
  link: z.string().url("Please enter a valid URL.").optional(),
  type: z.enum(["todo", "tweet", "youtube", "pdf"]),
  tags: z.array(z.string()).optional(),
  pdf: z.instanceof(File).optional(),
});

export default contentValidation;
