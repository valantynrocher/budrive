import { User } from "@/users/domain/User.entity";
import { beforeEach } from "node:test";

describe("User Entity (Domain rules)", () => {
  let user: User;

  beforeEach(() => {
    user = new User({
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
  });

  it("→ should be able to create a User instance", () => {
    user = new User({
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
    expect(user).toBeDefined();
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
});
