"use server";
import { SignUpSchema } from "@budrive/validation";
import { redirect } from "next/navigation";

type SignupActionResult =
  | { success: true }
  | { success: false; fieldErrors?: Record<string, string>; message?: string };

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signupAction(
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

  if (!BACKEND_URL) {
    throw new Error(
      "Erreur de configuration: NEXT_PUBLIC_BACKEND_URL non défini."
    );
  }

  const res = await fetch(`${BACKEND_URL}/auth/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return {
      success: false,
      fieldErrors: body.fieldErrors,
      message: body.message ?? "Inscription échouée",
    };
  }

  redirect("/auth/check-email");
}
