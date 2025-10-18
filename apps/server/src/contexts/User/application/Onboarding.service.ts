import { UserService } from "@/contexts/User/application/User.service";
import { VehicleService } from "@/contexts/Vehicle/application/Vehicle.service";
import { AuthErrors } from "@budrive/validation";
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class OnboardingService {
  constructor(
    private readonly userService: UserService,
    private readonly vehicleService: VehicleService,
  ) {}

  async completeStep1(
    userId: string,
    step1Dto: any, // TODO
  ): Promise<void> {
    // 1. Récupération de l'utilisateur pour vérification
    const user = await this.userService.findUserById(userId);

    if (!user) {
      // Gérer l'erreur (p. ex., lancer une BadRequestException)
      throw new UnauthorizedException(AuthErrors.USER_NOT_FOUND);
    }
    if (user.isOnboardingCompleted()) {
      throw new BadRequestException(AuthErrors.ONBOARDING_ALREADY_COMPLETE);
    }

    await this.vehicleService.createVehicle(userId, step1Dto);

    // 2. Mise à jour de l'état de l'utilisateur
    // Cette méthode doit implémenter : this.onboardingStatus = IN_PROGRESS et this.onboardingStep = 2
    user.updateOnboardingStep(2);

    // 3. Sauvegarde de l'état mis à jour
    await this.userService.save(user);
  }
}
