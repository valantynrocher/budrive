import { UserService } from "@/contexts/User/application/User.service";
import { VehicleService } from "@/contexts/Vehicle/application/Vehicle.service";
import { Vehicle } from "@/contexts/Vehicle/domain/Vehicle.entity";
import {
  AuthErrors,
  OnboardingStep1Dto,
  OnboardingStep2Dto,
} from "@budrive/validation";
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
    step1Dto: OnboardingStep1Dto,
  ): Promise<Vehicle> {
    const user = await this.checkUser(userId);

    const vehicle = await this.vehicleService.createVehicle(userId, step1Dto);

    user.updateOnboardingStep(2);

    await this.userService.save(user);

    return vehicle;
  }

  async completeStep2(
    userId: string,
    vehicleId: string,
    step2Dto: OnboardingStep2Dto,
  ): Promise<Vehicle> {
    const user = await this.checkUser(userId);

    const vehicle = await this.vehicleService.recordAcquisitionData(
      vehicleId,
      step2Dto,
    );

    user.updateOnboardingStep(3);

    await this.userService.save(user);

    return vehicle;
  }
}
