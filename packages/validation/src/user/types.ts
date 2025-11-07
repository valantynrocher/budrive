import { SuccessResponseDto } from "../shared";

export enum OnboardingStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  SKIPPED = "SKIPPED",
}

export type OnboardingStep1ResponseDto = SuccessResponseDto & {
  data: {
    vehicleId: string;
  };
};
export type OnboardingStep2ResponseDto = OnboardingStep1ResponseDto;
