import { JwtAuthGuard } from "@/contexts/Auth/infrastructure/guards/JwtAuth.guard";
import { OnboardingService } from "@/contexts/User/application/Onboarding.service";
import { ZodValidationPipe } from "@/shared/infrastructure/common/zod/zod-validation.pipe";
import {
  type OnboardingStep1Dto,
  type OnboardingStep1ResponseDto,
  OnboardingStep1Schema,
  type OnboardingStep2Dto,
  OnboardingStep2Schema,
  type SuccessResponseDto,
} from "@budrive/validation";
import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { type Request } from "express";

@UseGuards(JwtAuthGuard)
@Controller("onboarding")
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /**
   * POST /onboarding/skip
   */
  @Post("skip")
  async skip(@Req() req: Request): Promise<SuccessResponseDto> {
    const userId = req.user!.sub;

    await this.onboardingService.skip(userId);

    return {
      success: true,
      message: "Onboarding skipped successfully", // TODO: replace by message from @budrive/validation
    };
  }

  /**
   * POST /onboarding/step-1
   * Valide les données d'identification du véhicule et passe à l'étape 2.
   */
  @Post("step-1")
  async completeStep1(
    @Req() req: Request,
    @Body(new ZodValidationPipe(OnboardingStep1Schema))
    step1Dto: OnboardingStep1Dto,
  ): Promise<OnboardingStep1ResponseDto> {
    const userId = req.user!.sub;

    const vehicle = await this.onboardingService.completeStep1(
      userId,
      step1Dto,
    );

    return {
      success: true,
      message: "Vehicle identification recorded. Proceeding to step 2.", // TODO: replace by message from @budrive/validation
      data: {
        vehicleId: vehicle.getId(),
      },
    };
  }

  @Post("step-2")
  async completeStep2(
    @Req() req: Request,
    @Param("vehicleId") vehicleId: string,
    @Body(new ZodValidationPipe(OnboardingStep2Schema))
    step2Dto: OnboardingStep2Dto,
  ): Promise<
    SuccessResponseDto & {
      data: {
        vehicleId: string;
      };
    }
  > {
    const userId = req.user!.sub;

    const vehicle = await this.onboardingService.completeStep2(
      userId,
      vehicleId,
      step2Dto,
    );

    return {
      success: true,
      message: "Vehicle acquisition data recorded. Proceeding to step 3.", // TODO: replace by message from @budrive/validation
      data: {
        vehicleId: vehicle.getId(),
      },
    };
  }
}
