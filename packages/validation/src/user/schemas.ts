import { z } from "zod";
import { OnboardingStatus } from "./types";

export const OnboardingStatusSchema = z.nativeEnum(OnboardingStatus);

export const OnboardingInfosSchema = z.object({
  onboardingStatus: OnboardingStatusSchema,
  onboardingStep: z.number(),
});
export type OnboardingInfosDto = z.infer<typeof OnboardingInfosSchema>;
