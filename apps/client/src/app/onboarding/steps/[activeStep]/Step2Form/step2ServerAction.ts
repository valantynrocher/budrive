import config from "@/lib/api/config";
import {
  OnboardingErrors,
  type OnboardingStep2Dto,
  type OnboardingStep2ResponseDto,
} from "@budrive/validation";
import { redirect } from "next/navigation";

async function step2ServerAction(
  vehicleId: string,
  data: OnboardingStep2Dto
): Promise<string> {
  const requestOptions: RequestInit = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  const serverResponse = await fetch(
    `${config.appUrl}/api/onboarding/step-2?vehicleId=${vehicleId}`,
    requestOptions
  );

  const serverBody: OnboardingStep2ResponseDto = await serverResponse
    .json()
    .catch(() => ({}));

  if (!serverResponse.ok) {
    return serverBody.message ?? OnboardingErrors.STEP_UNKNOW_ERROR;
  }

  const _vehicleId = serverBody.data.vehicleId;
  redirect(`/onboarding/steps/3?v=${_vehicleId}`);
}

export default step2ServerAction;
