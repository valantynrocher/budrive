import { Token, TokenData } from "@/shared/domain/entities/Token.entity";

export type PasswordResetTokenData = TokenData & {
  createdAt: Date;
};

export class PasswordResetToken extends Token {
  private createdAt: Date;

  constructor(data: PasswordResetTokenData) {
    super(data);
    this.createdAt = data.createdAt;
  }

  // --- Getters ---
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public getTokenHash(): string {
    return this.token;
  }
}
