import { PasswordResetToken } from "@/contexts/Auth/domain/PasswordResetToken.entity";

describe("Token Entities (Domain rules)", () => {
  let token: PasswordResetToken; // should be a class that extends the parent Token class
  const futureDate = new Date(Date.now() + 3600000);
  const pastDate = new Date(Date.now() - 3600000);

  describe("Parent Token class", () => {
    describe("isExpired()", () => {
      it("→ should return false if expiresAt is in the future", () => {
        token = new PasswordResetToken({
          id: "testid123",
          token: "t$e$t$t$o$k$e$n$1$2$3",
          expiresAt: futureDate,
          userId: "testuserid123",
          createdAt: new Date(),
        });
        expect(token.isExpired()).toBe(false);
      });

      it("→ should return true if expiresAt is in the past", () => {
        token = new PasswordResetToken({
          id: "testid123",
          token: "t$e$t$t$o$k$e$n$1$2$3",
          expiresAt: pastDate,
          userId: "testuserid123",
          createdAt: new Date(),
        });
        expect(token.isExpired()).toBe(true);
      });
    });
  });
});
