import config from "@/lib/api/config";
import { SignInSchema } from "@budrive/validation";
import { redirect } from "next/navigation";

type SigninActionResult =
  | { success: true }
  | { success: false; fieldErrors?: Record<string, string>; message?: string };

async function signinServerAction(
  formData: FormData
): Promise<SigninActionResult> {
  const parsed = SignInSchema.safeParse(formData);
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

  // We use our internal route handler as proxy
  const requestOptions: RequestInit = {
    method: "POST",
    body: JSON.stringify(parsed.data),
    credentials: "include",
  };
  const res = await fetch(`${config.appUrl}/api/auth/sign-in`, requestOptions);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const response: SigninActionResult = {
      success: false,
      fieldErrors: body.fieldErrors,
      message: body.message ?? "Connexion échouée",
    };
    console.log("signinServerAction has failed and will respond :", response);
    return response;
  }

  redirect("/dashboard");
}

export default signinServerAction;
