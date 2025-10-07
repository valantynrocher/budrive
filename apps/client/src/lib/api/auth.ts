"use server";
import { AuthErrors, SignUpSchema } from "@budrive/validation";
import { redirect } from "next/navigation";
import parseSetCookie from "set-cookie-parser";
import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

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

type SameSiteType = ResponseCookie["sameSite"];

/**
 * Confirme l'utilisateur avec un token et gère la propagation des cookies d'authentification.
 * @param token Le token de confirmation reçu par email.
 */
export async function confirmUserAction(token: string) {
  if (!BACKEND_URL) {
    throw new Error(
      "Erreur de configuration: NEXT_PUBLIC_BACKEND_URL non défini."
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
      credentials: "include",
    });

    const body = await response.json();

    if (!response.ok) {
      redirect(
        `/auth/sign-in?error=${
          body.message || AuthErrors.CONFIRM_TOKEN_UNKNOW_ERROR
        }`
      );
    }

    const setCookieHeader = response.headers.get("set-cookie");

    if (setCookieHeader) {
      const parsedCookies = parseSetCookie.parse(setCookieHeader, {
        map: true,
      });

      for (const name in parsedCookies) {
        const cookie = parsedCookies[name];

        const sameSiteValue: SameSiteType =
          (cookie.sameSite?.toLowerCase() as SameSiteType) || undefined;

        (await cookies()).set(name, cookie.value, {
          path: cookie.path,
          domain: cookie.domain,
          expires: cookie.expires,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: sameSiteValue,
        });
      }
    }

    redirect("/dashboard");
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error(
      "Erreur critique: Échec de connexion au backend/Réseau",
      error
    );
    redirect(`/auth/sign-in?error=${AuthErrors.CONFIRM_TOKEN_UNKNOW_ERROR}`);
  }
}
