import { z } from "zod";

const nameValidation = z
  .string()
  .min(3, "Name must be at least 3 characters long")
  .max(50, "Name must not exceed 50 characters");

const emailValidation = z.string().email("Please enter a valid email address.");

const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(24, "Password must not exceed 24 characters.")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).*$/,
    "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character."
  );

export const signupUserValidation = z.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
});

export const loginUserValidation = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export const deleteUserValidation = z.object({
  password: passwordValidation,
});
