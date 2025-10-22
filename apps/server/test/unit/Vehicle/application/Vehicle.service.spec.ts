import { VehicleService } from "@/contexts/Vehicle/application/Vehicle.service";
import { Vehicle } from "@/contexts/Vehicle/domain/Vehicle.entity";
import {
  IVehicleRepository,
  VEHICLE_REPOSITORY,
} from "@/contexts/Vehicle/domain/VehicleRepository.interface";
import {
  FuelType,
  OnboardingStep1Dto,
  VehicleErrors,
} from "@budrive/validation";
import { ConflictException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

describe("VehicleService (Application Layer)", () => {
  let service: VehicleService;
  let repository: IVehicleRepository;

  // Définition du mock du Repository (implémente l'interface)
  const mockVehicleRepository = {
    save: jest.fn(),
    findByUserId: jest.fn(),
    findByLicensePlate: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: VEHICLE_REPOSITORY,
          useValue: mockVehicleRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<VehicleService>(VehicleService);
    repository = moduleRef.get<IVehicleRepository>(VEHICLE_REPOSITORY);

    mockVehicleRepository.findByLicensePlate.mockClear();
    mockVehicleRepository.findByUserId.mockClear();
    mockVehicleRepository.save.mockClear();
  });

  const mockUserId = "user-123";
  const mockStep1Dto: OnboardingStep1Dto = {
    make: "Tesla",
    model: "Model 3",
    mileage: 5000,
    yearOfCirculation: 2023,
    fuelType: FuelType.ELECTRIC,
    licensePlate: "DE-534-GH",
  };

  // Entité simulée, reconstruite par le Repository après DB
  const mockSavedVehicle = Vehicle.fromPersistence({
    id: "vehicle-uuid-1",
    userId: mockUserId,
    ...mockStep1Dto,
    fuelType: mockStep1Dto.fuelType as any,
    licensePlate: "DE-534-GH",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it("→ should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createVehicle method", () => {
    it("should successfully create a new vehicle and call the repository save method", async () => {
      mockVehicleRepository.save.mockResolvedValue(mockSavedVehicle);

      const result = await service.createVehicle(mockUserId, mockStep1Dto);

      // 1. Vérifie que la méthode save du Repository a été appelée
      expect(mockVehicleRepository.save).toHaveBeenCalledTimes(1);

      // 2. Vérifie que l'entité passée à save est une instance de Vehicle avec les bonnes données
      const vehiclePassedToSave = mockVehicleRepository.save.mock.calls[0][0];
      expect(vehiclePassedToSave).toBeInstanceOf(Vehicle);
      expect(vehiclePassedToSave.getUserId()).toBe(mockUserId);

      // 3. Vérifie que le service retourne le résultat du repository (avec l'ID DB)
      expect(result).toBe(mockSavedVehicle);
      expect(result.getId()).toBe("vehicle-uuid-1");
    });

    it("should throw ConflictException if vehicle license plate already exists", async () => {
      mockVehicleRepository.findByLicensePlate.mockResolvedValue(
        mockSavedVehicle,
      );
      await expect(
        service.createVehicle(mockUserId, mockStep1Dto),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.createVehicle(mockUserId, mockStep1Dto),
      ).rejects.toThrow(VehicleErrors.LICENSE_PLATE_CONFLICT);
    });
  });
});
