import { Injectable, Inject, ConflictException } from "@nestjs/common";
import { Vehicle } from "../domain/Vehicle.entity";
import {
  VEHICLE_REPOSITORY,
  IVehicleRepository,
} from "../domain/VehicleRepository.interface";
import { type OnboardingStep1Dto, VehicleErrors } from "@budrive/validation";

@Injectable()
export class VehicleService {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  /**
   * Step 1 of Onboarding
   */
  async createVehicle(
    userId: string,
    data: OnboardingStep1Dto,
  ): Promise<Vehicle> {
    // 1. Logique métier : vérifier si l'utilisateur a déjà un véhicule (si vous limitez à un seul)
    const plateExists = await this.vehicleRepository.findByLicensePlate(
      data.licensePlate,
    );
    if (plateExists) {
      throw new ConflictException(VehicleErrors.LICENSE_PLATE_CONFLICT);
    }

    // 2. Création de l'entité de domaine via la Factory Method
    const newVehicle = Vehicle.create(data, userId);

    // 3. Persistance via le Repository
    const savedVehicle = await this.vehicleRepository.save(newVehicle);

    return savedVehicle;
  }
}
