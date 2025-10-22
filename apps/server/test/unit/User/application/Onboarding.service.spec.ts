import { OnboardingService } from "@/contexts/User/application/Onboarding.service";
import { UserService } from "@/contexts/User/application/User.service";
import { User } from "@/contexts/User/domain";
import { VehicleService } from "@/contexts/Vehicle/application/Vehicle.service";
import { AuthErrors, FuelType, OnboardingStep1Dto } from "@budrive/validation";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { OnboardingStatus } from "@prisma/client";

describe("OnboardingService (Application Layer)", () => {
  let onboardingService: OnboardingService;
  // Mocks des services injectés
  const mockUserService = {
    save: jest.fn(),
    findUserById: jest.fn(),
  };
  const mockVehicleService = {
    createVehicle: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OnboardingService,
        { provide: UserService, useValue: mockUserService },
        { provide: VehicleService, useValue: mockVehicleService },
      ],
    }).compile();

    onboardingService = moduleRef.get<OnboardingService>(OnboardingService);
    jest.clearAllMocks();
  });

  const mockUserId = "user-id-test";
  // Données minimales nécessaires pour construire votre entité User
  const baseUserMocks = {
    id: mockUserId,
    email: "test@mail.com",
    passwordHash: "hash",
    fullName: null,
    isVerified: true,
    hashedRefreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("completeStep1 method", () => {
    const mockStep1Dto: OnboardingStep1Dto = {
      make: "Honda",
      model: "Civic",
      mileage: 10000,
      yearOfCirculation: 2020,
      fuelType: FuelType.GASOLINE,
      licensePlate: "DE-534-GH",
    };

    it("should orchestrate vehicle creation and update user state to step 2/IN_PROGRESS", async () => {
      // 1. Configuration initiale de l'utilisateur (PENDING, step 0) via votre constructeur
      const user = User.fromPersistence({
        ...baseUserMocks,
        onboardingStatus: OnboardingStatus.PENDING,
        onboardingStep: 0,
      } as any);
      mockUserService.findUserById.mockResolvedValue(user);

      await onboardingService.completeStep1(mockUserId, mockStep1Dto);

      // 2. Vérifie l'appel au service Vehicle
      expect(mockVehicleService.createVehicle).toHaveBeenCalledWith(
        mockUserId,
        mockStep1Dto,
      );

      // 3. Vérifie la mutation de l'entité User après l'appel à updateOnboardingStep(2)
      expect(user.getOnboardingStep()).toBe(2);
      expect(user.getOnboardingStatus()).toBe(OnboardingStatus.IN_PROGRESS);

      // 4. Vérifie la sauvegarde de l'utilisateur mis à jour
      expect(mockUserService.save).toHaveBeenCalledWith(user);
      expect(mockUserService.save).toHaveBeenCalledTimes(1);
    });

    it("should throw UnauthorizedException if user is not found", async () => {
      mockUserService.findUserById.mockResolvedValue(null);
      await expect(
        onboardingService.completeStep1(mockUserId, mockStep1Dto),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        onboardingService.completeStep1(mockUserId, mockStep1Dto),
      ).rejects.toThrow(AuthErrors.USER_NOT_FOUND);
    });

    it("should throw BadRequestException if user onboarding is already completed", async () => {
      // Initialisation d'un utilisateur COMPLETED
      const completedUser = User.fromPersistence({
        ...baseUserMocks,
        onboardingStatus: OnboardingStatus.COMPLETED,
        onboardingStep: 2,
      } as any);
      mockUserService.findUserById.mockResolvedValue(completedUser);

      await expect(
        onboardingService.completeStep1(mockUserId, mockStep1Dto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        onboardingService.completeStep1(mockUserId, mockStep1Dto),
      ).rejects.toThrow(AuthErrors.ONBOARDING_ALREADY_COMPLETE);

      expect(mockVehicleService.createVehicle).not.toHaveBeenCalled();
      expect(mockUserService.save).not.toHaveBeenCalled();
    });
  });
});
