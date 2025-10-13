import { UsersService } from "@/users/application/users.service";
import { IUserRepository, User, USER_REPOSITORY } from "@/users/domain";
import { Test, TestingModule } from "@nestjs/testing";

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

describe("UsersService (Application Layer)", () => {
  let service: UsersService;
  let repository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        // Câblage du Mock: l'interface est injectée avec l'objet mock
        { provide: USER_REPOSITORY, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<IUserRepository>(USER_REPOSITORY);

    mockUserRepository.findById.mockClear();
    mockUserRepository.save.mockClear();
  });

  it("→ should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("verify method", () => {
    it("→ should find the user, call the verify() entity method, and save the updated state", async () => {
      const mockUserEntity = new User({
        id: "15359d93-3c66-44bc-8f30-0ee96fb15263",
        email: "newuser1@example.com",
        passwordHash:
          "$2b$10$hN1kFo.1O5Ewciapol1tQON5zGpNyu3hR/S6CVygI5vzIEPwPVE4a",
        createdAt: new Date(),
        isVerified: false,
        hashedRefreshToken: null,
        fullName: null,
        updatedAt: null,
      });
      jest.spyOn(mockUserEntity, "verify"); // Espionner la méthode de l'Entité

      (repository.findById as jest.Mock).mockResolvedValue(mockUserEntity);
      (repository.save as jest.Mock).mockResolvedValue(mockUserEntity);

      await service.verify("test-user-id");

      expect(repository.findById).toHaveBeenCalledWith("test-user-id");
      expect(mockUserEntity.verify).toHaveBeenCalled(); // La règle métier a été appliquée
      expect(repository.save).toHaveBeenCalledWith(mockUserEntity); // Le changement a été persisté
    });

    it("→ should throw an error if user is not found", async () => {
      (repository.findById as jest.Mock).mockResolvedValue(null);
      await expect(service.verify("unknown-id")).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("updatehashedRefreshToken method", () => {
    const userId = "mock-user-id";
    const newHash = "new-hashed-token";
    const mockUser = {
      // Simuler l'entité User avec ses méthodes
      setRefreshTokenHash: jest.fn(),
      getId: () => userId,
    };
    const mockSavedUser = {
      /* L'objet User retourné par save */
    };

    it("→ should set the new refresh token hash and save the user", async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockSavedUser);

      const result = await service.updatehashedRefreshToken(userId, newHash);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.setRefreshTokenHash).toHaveBeenCalledWith(newHash);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(mockSavedUser);
    });

    it("→ should allow null to be set as the refresh token hash (logout)", async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockSavedUser);

      await service.updatehashedRefreshToken(userId, null);

      expect(mockUser.setRefreshTokenHash).toHaveBeenCalledWith(null);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it("→ should throw an error if the user is not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        service.updatehashedRefreshToken(userId, newHash),
      ).rejects.toThrow("User not found");
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("updatePasswordHash method", () => {
    const userId = "mock-user-id";
    const newPasswordHash = "new-hashed-password";
    const mockUser = {
      // Simuler l'entité User avec ses méthodes
      updatePassword: jest.fn(),
      getId: () => userId,
    };
    const mockSavedUser = {
      /* L'objet User retourné par save */
    };

    it("→ [SUCCESS] should update the password hash and save the user", async () => {
      // Préparation
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockSavedUser);

      const result = await service.updatePasswordHash(userId, newPasswordHash);

      // Assertions
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.updatePassword).toHaveBeenCalledWith(newPasswordHash);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(mockSavedUser);
    });

    it("→ [FAILURE] should throw an error if the user is not found", async () => {
      // Préparation
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        service.updatePasswordHash(userId, newPasswordHash),
      ).rejects.toThrow("User not found");
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
