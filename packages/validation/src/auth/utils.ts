import { z } from "zod";
import { AuthErrors } from "./errors";

export const passwordSchema = z
  .string({
    required_error: AuthErrors.PASSWORD_REQUIRED,
  })
  .min(1, AuthErrors.PASSWORD_REQUIRED)
  .min(8, AuthErrors.PASSWORD_TOO_SHORT);
