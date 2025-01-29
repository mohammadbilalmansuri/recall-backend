import { z, ZodSchema, ZodIssue } from "zod";
import ApiError from "./ApiError";

const validate = <T extends ZodSchema>(
  validator: T,
  data: Record<string, any>
): z.infer<T> => {
  const result = validator.safeParse(data);

  if (!result.success) {
    throw new ApiError(
      400,
      result.error.errors.map((e: ZodIssue) => e.message).join(", "),
      result.error.errors.map((e: ZodIssue) => e.message)
    );
  }

  return result.data as z.infer<T>;
};

export default validate;
