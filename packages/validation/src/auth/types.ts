import { SuccessResponseDto } from "../shared/types";
import { OnboardingInfosDto } from "../user";

export type ConfirmResponseDto = SuccessResponseDto & OnboardingInfosDto;
export type SignInResponseDto = SuccessResponseDto & OnboardingInfosDto;
