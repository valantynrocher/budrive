import { AuthErrors } from "./errors";
import { z } from "zod";
import { passwordSchema } from "./utils";

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
  password: passwordSchema,
});

export type AuthCredentialsDto = z.infer<typeof AuthCredentialsSchema>;

/**
 * SignUp
 */
export const SignUpSchema = AuthCredentialsSchema.extend({
  confirmPassword: passwordSchema,
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
