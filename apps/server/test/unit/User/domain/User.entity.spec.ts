import { User } from "@/contexts/User/domain/User.entity";
import { OnboardingStatus } from "@budrive/validation";

describe("User Entity (Domain rules)", () => {
  let user: User;
  const baseUserMock = {
    id: "15359d93-3c66-44bc-8f30-0ee96fb15263",
    email: "newuser1@example.com",
    passwordHash:
      "$2b$10$hN1kFo.1O5Ewciapol1tQON5zGpNyu3hR/S6CVygI5vzIEPwPVE4a",
  };

  beforeAll(() => {
    user = User.create({
      email: baseUserMock.email,
      passwordHash: baseUserMock.passwordHash,
    });
  });

  describe("create method", () => {
    it("should initialize a new user with PENDING status and step 0 by default", () => {
      expect(user.getOnboardingStatus()).toBe(OnboardingStatus.PENDING);
      expect(user.getOnboardingStep()).toBe(0);
      expect(user.isOnboardingCompleted()).toBe(false);
    });
  });

  describe("verify method", () => {
    it("→ should set isVerified to true when called on an unverified user", () => {
      user.verify();

      expect(user.isVerifiedUser()).toBe(true);
    });

    it("→ should do nothing when called on a verified user", () => {
      user.verify();

      expect(user.isVerifiedUser()).toBe(true);
    });
  });

  describe("updatePassword method", () => {
    it("→ should update the passwordHash", () => {
      const newPwdHash = "new_password_hash";

      user.updatePassword(newPwdHash);

      expect(user.getPasswordHash()).toEqual(newPwdHash);
    });
  });

  describe("setRefreshTokenHash method", () => {
    it("→ should update the hashed refresh token", () => {
      const newHash = "new_test_hash";

      user.setRefreshTokenHash(newHash);

      expect(user.getHashedRefreshToken()).toEqual(newHash);
    });
  });

  describe("onboarding methods", () => {
    it("should update the onboarding step and set status to IN_PROGRESS", () => {
      // Simule la complétion de l'étape 1
      user.updateOnboardingStep(1);

      expect(user.getOnboardingStep()).toBe(1);
      expect(user.getOnboardingStatus()).toBe(OnboardingStatus.IN_PROGRESS);

      // Simule la complétion de l'étape 2
      user.updateOnboardingStep(2);
      expect(user.getOnboardingStep()).toBe(2);
    });

    it("should set onboarding status to COMPLETED and return true for isOnboardingCompleted", () => {
      const user = User.fromPersistence({
        ...baseUserMock,
        onboardingStatus: OnboardingStatus.IN_PROGRESS,
        onboardingStep: 2,
        fullName: null,
        isVerified: true,
        hashedRefreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      user.completeOnboarding();

      expect(user.getOnboardingStatus()).toBe(OnboardingStatus.COMPLETED);
      expect(user.isOnboardingCompleted()).toBe(true);
    });
  });
});
