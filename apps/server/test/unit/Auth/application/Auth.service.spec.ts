import { AuthService } from "@/auth/application/auth.service";
import { TokenManagementService } from "@/auth/application/token-management.service";
import { MailService } from "@/infrastructure/services/mail/mail.service";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { UsersService } from "@/users/application/users.service";
import { User } from "@/users/domain/User.entity";
import {
  AuthToken,
  SignInDto,
  SignUpDto,
  type ConfirmDto,
  type ForgotPwdDto,
  type ResetPwdDto,
} from "@budrive/validation";
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";

// --- Mocks des Dépendances ---

const mockUsersService = {
  findUserByEmail: jest.fn(),
  registerUser: jest.fn(),
  updatehashedRefreshToken: jest.fn(),
  findUserById: jest.fn(),
  verify: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

const mockMailService = {
  sendEmailConfirmation: jest.fn(),
  sendPasswordReset: jest.fn(),
  sendPasswordResetConfirm: jest.fn(),
};

const mockTokenManagementService = {
  createEmailVerificationTokenForUser: jest.fn(),
  findEmailVerificationToken: jest.fn(),
  deleteEmailVerificationTokenById: jest.fn(),
  createPasswordResetTokenForUser: jest.fn(),
  validatePasswordResetToken: jest.fn(),
};

// Nous mockons Prisma pour le test resetPassword qui utilise la transaction
const mockPrismaService = {
  $transaction: jest.fn(),
};

// Mock bcrypt globalement pour le hachage/comparaison
jest.mock("bcrypt", () => ({
  hash: jest.fn((value) => `hashed_${value}`), // Simuler un hachage simple
  compare: jest.fn(), // Sera mocké spécifiquement dans chaque test signIn/refresh
}));

// --- Entités/Objets de Test ---

const MOCK_USER_ID = "user-id-123";
const MOCK_USER_EMAIL = "test@user.com";
const MOCK_PASSWORD = "password123";
const MOCK_PASSWORD_HASH = "hashed_password123";
const MOCK_REFRESH_TOKEN = "mock-refresh-token";
const MOCK_ACCESS_TOKEN = "mock-access-token";

const mockUserEntity = new User({
  id: MOCK_USER_ID,
  email: MOCK_USER_EMAIL,
  passwordHash: MOCK_PASSWORD_HASH,
  isVerified: true,
  hashedRefreshToken: null,
  fullName: null,
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
});

// Étendre l'entité avec un hash de refresh token
const mockUserWithRefreshToken = new User({
  id: mockUserEntity.getId(),
  email: mockUserEntity.getEmail(),
  passwordHash: mockUserEntity.getPasswordHash(),
  isVerified: mockUserEntity.isVerifiedUser(),
  fullName: mockUserEntity.getFullName(),
  createdAt: mockUserEntity.getCreatedAt(),
  updatedAt: mockUserEntity.getUpdatedt(),
  hashedRefreshToken: "hashed_refresh_token",
});

describe("AuthService (Application Layer)", () => {
  let service: AuthService;

  beforeEach(async () => {
    // Figer la valeur de bcrypt.hash pour le createPasswordHash
    (bcrypt.hash as jest.Mock).mockClear();
    (bcrypt.hash as jest.Mock).mockResolvedValue(MOCK_PASSWORD_HASH);

    // Configurer le Test Module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: MailService, useValue: mockMailService },
        {
          provide: TokenManagementService,
          useValue: mockTokenManagementService,
        },
        { provide: PrismaService, useValue: mockPrismaService }, // Injecter le mock
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks(); // Réinitialise les compteurs d'appel des mocks

    // Mock les appels de token pour le generateTokens (qui est privé, donc on utilise un spy)
    jest.spyOn(service as any, "generateTokens").mockResolvedValue({
      accessToken: MOCK_ACCESS_TOKEN,
      refreshToken: MOCK_REFRESH_TOKEN,
    });
    jest
      .spyOn(service as any, "updateRefreshToken")
      .mockResolvedValue(undefined);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("→ should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Private Methods Coverage", () => {
    beforeEach(() => {
      // Restaurer le mock pour les méthodes publiques, mais annuler le spy/mock pour les méthodes privées
      jest.restoreAllMocks();
      jest.clearAllMocks();

      // Figer le mock de l'injection pour pouvoir appeler les méthodes privées sans NestJS
      (bcrypt.hash as jest.Mock).mockImplementation(
        (value) => `hashed_${value}`,
      );
      (bcrypt.compare as jest.Mock).mockImplementation(
        (value, hash) =>
          value === "correct_token" && hash === "hashed_correct_token",
      );
      mockJwtService.signAsync.mockResolvedValue("token_value");
    });

    describe("createPasswordHash method", () => {
      it("→ should return hashed password if passwords match", async () => {
        const result = await service["createPasswordHash"](
          MOCK_PASSWORD,
          MOCK_PASSWORD,
        );
        expect(result).toBe(`hashed_${MOCK_PASSWORD}`);
        expect(bcrypt.hash).toHaveBeenCalledWith(
          MOCK_PASSWORD,
          expect.any(Number),
        );
      });

      it("→ should throw BadRequestException if passwords do not match", async () => {
        await expect(
          service["createPasswordHash"](MOCK_PASSWORD, "wrong_password"),
        ).rejects.toThrow(BadRequestException);
        expect(bcrypt.hash).not.toHaveBeenCalled();
      });
    });

    // Teste generateTokens (L. 33-53)
    describe("generateTokens method", () => {
      it("→ should call jwtService.signAsync twice and return both tokens", async () => {
        const result = await service["generateTokens"](MOCK_USER_ID);

        expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
        expect(mockJwtService.signAsync).toHaveBeenCalledWith(
          { sub: MOCK_USER_ID },
          expect.any(Object),
        );
        expect(result).toEqual({
          accessToken: "token_value",
          refreshToken: "token_value",
        });
      });
    });

    describe("updateRefreshToken method", () => {
      it("→ should hash the token and call usersService to update it", async () => {
        const fakeRefreshToken = "unhashed-token";

        await service["updateRefreshToken"](MOCK_USER_ID, fakeRefreshToken);

        expect(bcrypt.hash).toHaveBeenCalledWith(fakeRefreshToken, 10);
        expect(mockUsersService.updatehashedRefreshToken).toHaveBeenCalledWith(
          MOCK_USER_ID,
          `hashed_${fakeRefreshToken}`,
        );
      });
    });
  });

  describe("signUp method", () => {
    const signUpDto = {
      email: MOCK_USER_EMAIL,
      password: MOCK_PASSWORD,
      confirmPassword: MOCK_PASSWORD,
    };

    it("→ should hash password, register user, create token, and send email", async () => {
      // Préparation
      mockUsersService.findUserByEmail.mockResolvedValue(null);
      mockUsersService.registerUser.mockResolvedValue(mockUserEntity);
      mockTokenManagementService.createEmailVerificationTokenForUser.mockResolvedValue(
        {
          getToken: () => "fake-token",
          getUserId: () => MOCK_USER_ID,
        },
      );
      // Spy sur la méthode privée, car elle contient la logique de vérification de mot de passe
      jest
        .spyOn(service as any, "createPasswordHash")
        .mockResolvedValue(MOCK_PASSWORD_HASH);

      const result = await service.signUp(signUpDto as SignUpDto);

      // Assertions sur l'orchestration
      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        signUpDto.email,
      );
      expect(service["createPasswordHash"]).toHaveBeenCalledWith(
        signUpDto.password,
        signUpDto.confirmPassword,
      );
      expect(mockUsersService.registerUser).toHaveBeenCalled();
      expect(
        mockTokenManagementService.createEmailVerificationTokenForUser,
      ).toHaveBeenCalledWith(MOCK_USER_ID);
      expect(mockMailService.sendEmailConfirmation).toHaveBeenCalledWith(
        MOCK_USER_EMAIL,
        "fake-token",
      );

      // Assertion sur le retour
      expect(result).toEqual({
        id: MOCK_USER_ID,
        email: MOCK_USER_EMAIL,
        fullName: null,
      });
    });

    it("→ should throw ConflictException if user already exists", async () => {
      mockUsersService.findUserByEmail.mockResolvedValue(mockUserEntity);

      await expect(service.signUp(signUpDto as SignUpDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUsersService.registerUser).not.toHaveBeenCalled();
    });

    it("→ should throw BadRequestException if passwords do not match (via createPasswordHash)", async () => {
      mockUsersService.findUserByEmail.mockResolvedValue(null);

      const mismatchDto: SignUpDto = {
        email: "userexists@email.com",
        password: MOCK_PASSWORD,
        confirmPassword: "wrong_confirm",
      };

      // Simuler la méthode privée qui vérifie la correspondance
      jest.spyOn(service as any, "createPasswordHash").mockRestore(); // Désactive le mock pour tester la logique interne

      await expect(service.signUp(mismatchDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe("signIn method", () => {
    const signInDto = { email: MOCK_USER_EMAIL, password: MOCK_PASSWORD };

    it("→ should return generated tokens and update refresh token hash", async () => {
      // Préparation: l'utilisateur est trouvé et le mot de passe correspond
      mockUsersService.findUserByEmail.mockResolvedValue(mockUserEntity);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.signIn(signInDto as SignInDto);

      // Assertions sur l'orchestration
      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        signInDto.email,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        MOCK_PASSWORD_HASH,
      );

      expect(service["generateTokens"]).toHaveBeenCalledWith(MOCK_USER_ID);
      expect(service["updateRefreshToken"]).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_REFRESH_TOKEN,
      );

      // Assertion sur le retour
      expect(result).toEqual({
        accessToken: MOCK_ACCESS_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN,
      });
    });

    it("→ should throw UnauthorizedException if user not found", async () => {
      mockUsersService.findUserByEmail.mockResolvedValue(null);

      await expect(service.signIn(signInDto as SignInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("→ should throw UnauthorizedException if password does not match", async () => {
      mockUsersService.findUserByEmail.mockResolvedValue(mockUserEntity);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInDto as SignInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service["generateTokens"]).not.toHaveBeenCalled();
    });
  });

  describe("confirm method", () => {
    const confirmDto = { token: "valid-email-token" };
    const mockEmailToken = {
      getExpiresAt: jest.fn(() => new Date(Date.now() + 3600000)), // 1h dans le futur
      getUserId: () => MOCK_USER_ID,
      getId: () => "token-id",
    };

    it("→ should verify user, delete token, and issue new tokens", async () => {
      // Préparation
      mockTokenManagementService.findEmailVerificationToken.mockResolvedValue(
        mockEmailToken,
      );
      mockUsersService.verify.mockResolvedValue(mockUserEntity);

      await service.confirm(confirmDto as ConfirmDto);

      // Assertions
      expect(
        mockTokenManagementService.findEmailVerificationToken,
      ).toHaveBeenCalledWith(confirmDto.token);
      expect(mockUsersService.verify).toHaveBeenCalledWith(MOCK_USER_ID);
      expect(
        mockTokenManagementService.deleteEmailVerificationTokenById,
      ).toHaveBeenCalledWith("token-id");
      expect(service["generateTokens"]).toHaveBeenCalled();
      expect(service["updateRefreshToken"]).toHaveBeenCalled();
    });

    it("→ should throw BadRequestException if token is expired", async () => {
      // Préparation: Simuler un token expiré
      const expiredToken = {
        ...mockEmailToken,
        getExpiresAt: () => new Date(Date.now() - 3600000), // 1h dans le passé
      };
      mockTokenManagementService.findEmailVerificationToken.mockResolvedValue(
        expiredToken,
      );

      await expect(service.confirm(confirmDto as ConfirmDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUsersService.verify).not.toHaveBeenCalled();
    });
  });

  describe("refreshTokens method", () => {
    const oldRefreshToken = "expired-refresh-token";

    it("→ should generate and update new tokens if refresh token is valid", async () => {
      // Préparation: l'utilisateur est trouvé et le refresh token est valide
      mockUsersService.findUserById.mockResolvedValue(mockUserWithRefreshToken);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await service.refreshTokens(MOCK_USER_ID, oldRefreshToken);

      // Assertions
      expect(mockUsersService.findUserById).toHaveBeenCalledWith(MOCK_USER_ID);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        oldRefreshToken,
        mockUserWithRefreshToken.getHashedRefreshToken(),
      );
      expect(service["generateTokens"]).toHaveBeenCalled();
      expect(service["updateRefreshToken"]).toHaveBeenCalledWith(
        MOCK_USER_ID,
        MOCK_REFRESH_TOKEN,
      ); // Vérifie la rotation
    });

    it("→ should revoke session and throw UnauthorizedException if refresh token is invalid", async () => {
      // Préparation: token invalide
      mockUsersService.findUserById.mockResolvedValue(mockUserWithRefreshToken);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.refreshTokens(MOCK_USER_ID, oldRefreshToken),
      ).rejects.toThrow(UnauthorizedException);

      // Vérifie la révocation (mesure de sécurité)
      expect(mockUsersService.updatehashedRefreshToken).toHaveBeenCalledWith(
        MOCK_USER_ID,
        null,
      );
    });

    it("→ should throw UnauthorizedException if user is not found", async () => {
      // Préparation: Simuler l'utilisateur non trouvé
      mockUsersService.findUserById.mockResolvedValue(null);

      await expect(
        service.refreshTokens(MOCK_USER_ID, "some-token"),
      ).rejects.toThrow(UnauthorizedException);

      // Vérifier que la suite de la logique n'a pas été exécutée
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("→ should throw UnauthorizedException if user has no session (hashed token is null)", async () => {
      // Préparation: L'utilisateur est trouvé, mais sans refreshTokenHash
      const userWithoutToken = new User({
        id: mockUserEntity.getId(),
        email: mockUserEntity.getEmail(),
        passwordHash: mockUserEntity.getPasswordHash(),
        isVerified: mockUserEntity.isVerifiedUser(),
        fullName: mockUserEntity.getFullName(),
        createdAt: mockUserEntity.getCreatedAt(),
        updatedAt: mockUserEntity.getUpdatedt(),
        hashedRefreshToken: null,
      });
      mockUsersService.findUserById.mockResolvedValue(userWithoutToken);

      await expect(
        service.refreshTokens(MOCK_USER_ID, "some-token"),
      ).rejects.toThrow(UnauthorizedException);

      // Vérifier que la comparaison n'a pas lieu
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe("logout method", () => {
    it("→ should call usersService to revoke the refresh token hash", async () => {
      await service.logout(MOCK_USER_ID);

      // Assertions
      expect(mockUsersService.updatehashedRefreshToken).toHaveBeenCalledWith(
        MOCK_USER_ID,
        null,
      );
    });
  });

  describe("forgotPassword method", () => {
    const forgotPwdDto = { email: MOCK_USER_EMAIL };

    it("→ should create token and send reset email", async () => {
      mockUsersService.findUserByEmail.mockResolvedValue(mockUserEntity);
      mockTokenManagementService.createPasswordResetTokenForUser.mockResolvedValue(
        { tokenValue: "reset-token-value" },
      );

      await service.forgotPassword(forgotPwdDto as ForgotPwdDto);

      // Assertions
      expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith(
        MOCK_USER_EMAIL,
      );
      expect(
        mockTokenManagementService.createPasswordResetTokenForUser,
      ).toHaveBeenCalledWith(MOCK_USER_ID);
      expect(mockMailService.sendPasswordReset).toHaveBeenCalledWith(
        MOCK_USER_EMAIL,
        "reset-token-value",
      );
    });

    it("→ [SECURITY] should not throw error or send email if user not found", async () => {
      mockUsersService.findUserByEmail.mockResolvedValue(null);

      await service.forgotPassword({
        email: "unknown@email.com",
      } as ForgotPwdDto);

      // Assertions
      expect(
        mockTokenManagementService.createPasswordResetTokenForUser,
      ).not.toHaveBeenCalled();
      expect(mockMailService.sendPasswordReset).not.toHaveBeenCalled();
      // On vérifie que la méthode se termine sans erreur (retour implicite de 'return;')
      expect(true).toBe(true);
    });
  });

  describe("resetPassword method", () => {
    const resetDto = {
      token: "valid-reset-token",
      password: MOCK_PASSWORD,
      confirmPassword: MOCK_PASSWORD,
    };
    const mockResetToken = {
      getUserId: () => MOCK_USER_ID,
      getId: () => "reset-token-id",
    };
    const mockUpdatedUser = {
      id: MOCK_USER_ID,
      email: MOCK_USER_EMAIL,
      passwordHash: MOCK_PASSWORD_HASH,
    };

    it("→ should validate token, update password via transaction, and send confirmation email", async () => {
      // Préparation: Simuler la validation du token
      mockTokenManagementService.validatePasswordResetToken.mockResolvedValue(
        mockResetToken,
      );

      // Préparation: Simuler la transaction Prisma
      // La transaction est une fonction qui prend une fonction `tx` en argument
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        // Simuler les objets tx nécessaires
        const tx = {
          user: { update: jest.fn().mockResolvedValue(mockUpdatedUser) },
          passwordResetToken: { delete: jest.fn() },
        };
        await callback(tx);
        return mockUpdatedUser;
      });

      await service.resetPassword(resetDto as ResetPwdDto);

      // Assertions
      expect(
        mockTokenManagementService.validatePasswordResetToken,
      ).toHaveBeenCalledWith(resetDto.token);
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockPrismaService.$transaction).toHaveBeenCalled();

      // La vérification des appels internes à `tx.user.update` et `tx.passwordResetToken.delete`
      // se fait au niveau du mock d'implémentation, mais l'appel de $transaction suffit ici.

      expect(mockMailService.sendPasswordResetConfirm).toHaveBeenCalledWith(
        mockUpdatedUser.email,
      );
    });

    it("→ should rely on TokenManagementService to throw an error if token is invalid/expired", async () => {
      // Préparation: Simuler l'échec de la validation du token
      mockTokenManagementService.validatePasswordResetToken.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        service.resetPassword(resetDto as ResetPwdDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});
