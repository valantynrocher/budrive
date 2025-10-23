import config from "@/lib/api/config";
import { OnboardingErrors, OnboardingStep1Dto } from "@budrive/validation";
import { redirect } from "next/navigation";

async function step1ServerAction(data: OnboardingStep1Dto): Promise<string> {
  const requestOptions: RequestInit = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  const serverResponse = await fetch(
    `${config.appUrl}/api/onboarding/step-1`,
    requestOptions
  );

  if (!serverResponse.ok) {
    const serverBody = await serverResponse.json().catch(() => ({}));

    return serverBody.message ?? OnboardingErrors.STEP_UNKNOW_ERROR;
  }

  redirect("/onboarding/steps/2");
}

export default step1ServerAction;
