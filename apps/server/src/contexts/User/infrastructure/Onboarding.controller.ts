import { JwtAuthGuard } from "@/contexts/Auth/infrastructure/guards/JwtAuth.guard";
import { OnboardingService } from "@/contexts/User/application/Onboarding.service";
import { ZodValidationPipe } from "@/shared/infrastructure/common/zod/zod-validation.pipe";
import {
  SuccessResponseDto,
  type Step1VehicleDto,
  Step1VehicleSchema,
} from "@budrive/validation";
import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { type Request } from "express";

@UseGuards(JwtAuthGuard) // Tous les endpoints nécessitent une authentification
@Controller("onboarding")
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /**
   * POST /onboarding/step-1
   * Valide les données d'identification du véhicule et passe à l'étape 2.
   */
  @Post("step-1")
  async postStep1(
    @Req() req: Request,
    @Body(new ZodValidationPipe(Step1VehicleSchema)) step1Dto: Step1VehicleDto,
  ): Promise<SuccessResponseDto> {
    const userId = req.user!.sub;

    // Le service gère l'orchestration (création du véhicule, mise à jour de l'état utilisateur)
    await this.onboardingService.completeStep1(userId, step1Dto);

    return {
      success: true,
      message: "Vehicle identification recorded. Proceeding to step 2.",
      // Nous ne renvoyons PAS l'état complet de l'utilisateur ici,
      // car le frontend doit le récupérer après re-authentification ou une requête GET /user/me
    };
  }

  // TODO : étapes suivantes : step-2, step-3...
}
