import { AuthErrors } from "@/common/errors";
import { z } from "zod";

/**
 * AuthCredentials
 */
export const AuthCredentialsSchema = z.object({
  email: z
    .string({
      required_error: AuthErrors.EMAIL_REQUIRED,
    })
    .min(1, AuthErrors.EMAIL_REQUIRED)
    .email(AuthErrors.EMAIL_INVALID),
  password: z
    .string({
      required_error: AuthErrors.PASSWORD_REQUIRED,
    })
    .min(1, AuthErrors.PASSWORD_REQUIRED)
    .min(8, AuthErrors.PASSWORD_TOO_SHORT),
});

export type AuthCredentialsDto = z.infer<typeof AuthCredentialsSchema>;

/**
 * SignUp
 */
export const SignUpSchema = AuthCredentialsSchema.extend({
  confirmPassword: z
    .string({
      required_error: AuthErrors.CONFIRM_PASSWORD_REQUIRED,
    })
    .min(1, AuthErrors.CONFIRM_PASSWORD_REQUIRED)
    .min(8, AuthErrors.PASSWORD_TOO_SHORT),
  fullName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: AuthErrors.CONFIRM_PASSWORD_NOT_MATCH,
  path: ["confirmPassword"],
});

export type SignUpDto = z.infer<typeof SignUpSchema>;

/**
 * SignIn
 */
export const SignInSchema = AuthCredentialsSchema;

export type SignInDto = z.infer<typeof SignInSchema>;

/**
 * Confirm
 */
export const ConfirmSchema = z.object({
  token: z.string().nonempty(AuthErrors.TOKEN_REQUIRED),
});

export type ConfirmDto = z.infer<typeof ConfirmSchema>;
