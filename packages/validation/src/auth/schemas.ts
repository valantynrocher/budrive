import { z } from "zod";
import { AuthErrors } from "./messages";
import { emailValidation, passwordValidation } from "./utils";

/**
 * AuthCredentials
 */
export const AuthCredentialsSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

export type AuthCredentialsDto = z.infer<typeof AuthCredentialsSchema>;

/**
 * SignUp
 */
export const SignUpSchema = AuthCredentialsSchema.extend({
  confirmPassword: passwordValidation,
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

/**
 * ForgotPassword
 */
export const ForgotPwdSchema = z.object({
  email: emailValidation,
});

export type ForgotPwdDto = z.infer<typeof ForgotPwdSchema>;

/**
 * ResetPassword
 */
export const ResetPwdSchema = z
  .object({
    token: z.string().nonempty(AuthErrors.TOKEN_REQUIRED),
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: AuthErrors.CONFIRM_PASSWORD_NOT_MATCH,
    path: ["confirmPassword"],
  });

export type ResetPwdDto = z.infer<typeof ResetPwdSchema>;
