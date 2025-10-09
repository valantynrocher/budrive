"use server";
import config from "@/lib/api/config";
import { ForgotPwdSchema } from "@budrive/validation";

type ForgotPwdActionResult =
  | { success: true }
  | { success: false; fieldErrors?: Record<string, string>; message?: string };

async function forgotPwdServerAction(
  formData: FormData
): Promise<ForgotPwdActionResult> {
  const parsed = ForgotPwdSchema.safeParse(formData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((issue) => {
      const key = (issue.path?.[0] as string) || "_";
      fieldErrors[key] = fieldErrors[key]
        ? `${fieldErrors[key]}; ${issue.message}`
        : issue.message;
    });
    return { success: false, fieldErrors };
  }

  const res = await fetch(`${config.backendUrl}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const response: ForgotPwdActionResult = {
      success: false,
      fieldErrors: body.fieldErrors,
      message: body.message ?? "Demande de réinitialisation échouée",
    };
    return response;
  }

  return {
    success: true,
  };
}

export default forgotPwdServerAction;
