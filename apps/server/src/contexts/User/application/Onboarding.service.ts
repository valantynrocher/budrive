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

  private async checkUser(userId: string) {
    // Récupération de l'utilisateur pour vérification
    const user = await this.userService.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException(AuthErrors.USER_NOT_FOUND);
    }
    if (user.isOnboardingCompleted()) {
      throw new BadRequestException(AuthErrors.ONBOARDING_ALREADY_COMPLETE);
    }

    return user;
  }

  async skip(userId: string): Promise<void> {
    const user = await this.checkUser(userId);

    user.skipOnboarding();

    await this.userService.save(user);
  }

  async completeStep1(
    userId: string,
    step1Dto: any, // TODO
  ): Promise<void> {
    const user = await this.checkUser(userId);

    // Création du véhicule
    await this.vehicleService.createVehicle(userId, step1Dto);

    // Mise à jour de l'état de l'utilisateur
    user.updateOnboardingStep(2);

    // Sauvegarde de l'état mis à jour
    await this.userService.save(user);
  }
}
