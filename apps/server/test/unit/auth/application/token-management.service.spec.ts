import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { TokenManagementService } from "@/auth/application/token-management.service";
import { PasswordResetToken } from "@/auth/domain/PasswordResetToken.entity";
import {
  ITokenRepository,
  TOKEN_REPOSITORY,
} from "@/auth/domain/TokenRepository.interface";
import { NotFoundException } from "@nestjs/common";
import { randomBytes } from "crypto"; // Assurez-vous d'importer randomBytes ou de le mocker

jest.mock("bcrypt", () => ({
  hash: jest.fn(async (value) => `hashed_${value}`),
  compare: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "mocked-uuid-for-email-token"),
  randomBytes: jest.fn(() => ({
    toString: jest.fn(() => "mocked_token_value"), // Valeur non hachée
  })),
}));

const mockTokenRepository: Partial<ITokenRepository> = {
  createEmailVerificationToken: jest.fn(),
  findEmailVerificationTokenByToken: jest.fn(),
  deleteEmailVerificationTokenById: jest.fn(),
  createPasswordResetToken: jest.fn(),
  deletePasswordResetTokenById: jest.fn(),
  findAllActiveResetTokens: jest.fn(),
};

const realTokenValue = "secret123";
const realTokenHash = "$2a$10$abcdefghijklmnopqrstuvwx/hash";

const mockTokenEntity = new PasswordResetToken({
  id: "testid123",
  token: realTokenHash,
  expiresAt: new Date(new Date("2025-10-13").valueOf() + 3600000),
  userId: "testuserid123",
  createdAt: new Date(),
});

describe("TokenManagementService (Application Layer)", () => {
  let service: TokenManagementService;
  let repository: ITokenRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenManagementService,
        { provide: TOKEN_REPOSITORY, useValue: mockTokenRepository },
      ],
    }).compile();

    service = module.get<TokenManagementService>(TokenManagementService);
    repository = module.get<ITokenRepository>(TOKEN_REPOSITORY);

    (bcrypt.compare as jest.Mock).mockClear();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("→ should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createEmailVerificationTokenForUser method", () => {
    const fixedTime = 1728700000000; // Exemple d'un timestamp fixe
    const expectedExpiration = fixedTime + 1000 * 60 * 60 * 24;

    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(fixedTime);
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    it("→ should return the token entity", async () => {
      (repository.createEmailVerificationToken as jest.Mock).mockClear();
      (repository.createEmailVerificationToken as jest.Mock).mockResolvedValue(
        mockTokenEntity,
      );

      await service.createEmailVerificationTokenForUser("testuserid123");

      expect(repository.createEmailVerificationToken).toHaveBeenCalledWith({
        token: expect.any(String), // Vérifier qu'une string a été générée
        userId: "testuserid123",
        expiresAt: new Date(expectedExpiration), // Vérifier la date calculée
      });
    });
  });

  describe("validatePasswordResetToken method", () => {
    it("→ should return the token entity if tokenValue matches an active token hash", async () => {
      (repository.findAllActiveResetTokens as jest.Mock).mockResolvedValue([
        mockTokenEntity,
      ]);

      (bcrypt.compare as jest.Mock).mockImplementation(async (value, hash) => {
        return value === realTokenValue && hash === realTokenHash;
      });

      const result = await service.validatePasswordResetToken(realTokenValue);

      expect(repository.findAllActiveResetTokens).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        realTokenValue,
        realTokenHash,
      );
      expect(result).toBe(mockTokenEntity);
    });

    it("→ should throw NotFoundException if bcrypt.compare fails for all active tokens", async () => {
      const wrongTokenValue = "wrongsecret";

      (repository.findAllActiveResetTokens as jest.Mock).mockResolvedValue([
        mockTokenEntity,
      ]);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validatePasswordResetToken(wrongTokenValue),
      ).rejects.toThrow(NotFoundException);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        wrongTokenValue,
        realTokenHash,
      );
    });
  });

  describe("createPasswordResetTokenForUser method", () => {
    const userId = "user-to-reset";
    const mockedTokenValue = "mocked_token_value";
    const mockedHashedToken = `hashed_mocked_token_value`;

    // Figer le temps pour tester l'expiration
    const fixedTime = 1678886400000; // Un timestamp fixe
    const expectedExpiration = fixedTime + 1000 * 60 * 60 * 24; // Temps fixé + 24h

    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(fixedTime);
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    it("→ should hash token, call repository with correct dates, and return unhashed token value", async () => {
      (
        mockTokenRepository.createPasswordResetToken as jest.Mock
      ).mockResolvedValue({});

      const result = await service.createPasswordResetTokenForUser(userId);

      // 1. Assertions sur l'orchestration
      expect(randomBytes).toHaveBeenCalledWith(32);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockedTokenValue, 10);

      // 2. Vérification de l'appel au Repository (la logique de l'expiration)
      expect(mockTokenRepository.createPasswordResetToken).toHaveBeenCalledWith(
        {
          token: mockedHashedToken, // Vérifier le token HACHÉ
          userId: userId,
          expiresAt: new Date(expectedExpiration), // Vérifier la date + 24h
          createdAt: new Date(fixedTime), // Vérifier la date de création
        },
      );

      // 3. Assertion sur le retour (le token NON haché)
      expect(result).toEqual({ tokenValue: mockedTokenValue });
    });
  });
});
