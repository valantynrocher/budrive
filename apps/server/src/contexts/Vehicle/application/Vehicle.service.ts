import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { Vehicle } from "../domain/Vehicle.entity";
import {
  VEHICLE_REPOSITORY,
  IVehicleRepository,
} from "../domain/VehicleRepository.interface";
import {
  type OnboardingStep1Dto,
  OnboardingStep2Dto,
  VehicleErrors,
} from "@budrive/validation";

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

  async recordAcquisitionData(
    vehicleId: string,
    data: OnboardingStep2Dto,
  ): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findById(vehicleId);

    if (!vehicle) {
      throw new NotFoundException(
        `Véhicule avec l'ID ${vehicleId} non trouvé.`,
      );
    }

    vehicle.recordAcquisitionData(data);

    // 3. Persister l'Entité dans la base de données (Supabase)
    const updatedVehicle = await this.vehicleRepository.save(vehicle);

    return updatedVehicle;
  }
}
