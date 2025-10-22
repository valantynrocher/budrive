import config from "@/lib/api/config";
import { OnboardingStep1Schema } from "@budrive/validation";
import { redirect } from "next/navigation";

type Step1ActionResult =
  | { success: true }
  | { success: false; fieldErrors?: Record<string, string>; message?: string };

async function step1ServerAction(
  formData: FormData
): Promise<Step1ActionResult> {
  const parsed = OnboardingStep1Schema.safeParse(formData);
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
  const res = await fetch(
    `${config.appUrl}/api/onboarding/step-1`,
    requestOptions
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const response: Step1ActionResult = {
      success: false,
      fieldErrors: body.fieldErrors,
      message: body.message ?? "L'Étape 1 a échouée",
    };

    return response;
  }

  redirect("/onboarding/steps/2");
}

export default step1ServerAction;
