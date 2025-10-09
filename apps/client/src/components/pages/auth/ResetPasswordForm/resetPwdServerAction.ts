"use server";
import config from "@/lib/api/config";
import { ResetPwdSchema } from "@budrive/validation";
import { redirect } from "next/navigation";

type ResetPwdActionResult =
  | { success: true }
  | { success: false; fieldErrors?: Record<string, string>; message?: string };

async function resetPwdServerAction(
  formData: FormData,
  token: string
): Promise<ResetPwdActionResult> {
  const parsed = ResetPwdSchema.safeParse({
    token,
    ...formData,
  });

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

  const res = await fetch(`${config.backendUrl}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const response: ResetPwdActionResult = {
      success: false,
      fieldErrors: body.fieldErrors,
      message: body.message ?? "Demande de réinitialisation échouée",
    };
    return response;
  }

  redirect("/auth/sign-in");
}

export default resetPwdServerAction;
