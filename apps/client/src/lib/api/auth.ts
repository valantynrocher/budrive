"use server";
import { SignUpSchema } from "@budrive/validation";
import { redirect } from "next/navigation";

type SignupActionResult =
  | { success: true }
  | { success: false; fieldErrors?: Record<string, string>; message?: string };

export async function signupAction(
  formData: FormData
): Promise<SignupActionResult> {
  console.log("signupAction", formData);

  // const raw = Object.fromEntries(formData) as Record<string, string>;

  // Validation serveur immédiate (Zod)
  const parsed = SignUpSchema.safeParse(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    parsed.error.errors.forEach((issue) => {
      const key = (issue.path?.[0] as string) || "_";
      // concatène si plusieurs erreurs sur le même champ
      fieldErrors[key] = fieldErrors[key]
        ? `${fieldErrors[key]}; ${issue.message}`
        : issue.message;
    });
    return { success: false, fieldErrors };
  }

  // Appel de ton backend NestJS
  const res = await fetch(`${process.env.BACKEND_URL}/auth/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    // On s'attend idéalement à ce que l'API renvoie { fieldErrors?: {...}, message?: '...' }
    const body = await res.json().catch(() => ({}));
    return {
      success: false,
      fieldErrors: body.fieldErrors,
      message: body.message ?? "Inscription échouée",
    };
  }

  // Succès : redirection vers la page "vérifiez votre mail"
  redirect("/auth/check-email");
}
