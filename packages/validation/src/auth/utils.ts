import { z } from "zod";
import { AuthErrors } from "./messages";

export const emailValidation = z
  .string({
    required_error: AuthErrors.EMAIL_REQUIRED,
  })
  .min(1, AuthErrors.EMAIL_REQUIRED)
  .email(AuthErrors.EMAIL_INVALID);

export const passwordValidation = z
  .string({
    required_error: AuthErrors.PASSWORD_REQUIRED,
  })
  .min(1, AuthErrors.PASSWORD_REQUIRED)
  .min(8, AuthErrors.PASSWORD_TOO_SHORT);
