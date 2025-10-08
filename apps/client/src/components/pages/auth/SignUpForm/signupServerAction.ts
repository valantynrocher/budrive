"use server";
import config from "@/lib/api/config";
import { SignUpSchema } from "@budrive/validation";
import { redirect } from "next/navigation";

type SignupActionResult =
  | { success: true }
  | { success: false; fieldErrors?: Record<string, string>; message?: string };

async function signupServerAction(
  formData: FormData
): Promise<SignupActionResult> {
  const parsed = SignUpSchema.safeParse(formData);
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

  const res = await fetch(`${config.backendUrl}/auth/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const response: SignupActionResult = {
      success: false,
      fieldErrors: body.fieldErrors,
      message: body.message ?? "Inscription échouée",
    };
    return response;
  }

  redirect("/auth/check-email");
}

export default signupServerAction;
