import { EmailVerificationToken } from "./EmailVerificationToken.entity";
import { PasswordResetToken } from "./PasswordResetToken.entity";

export const TOKEN_REPOSITORY = "ITokenRepository";

export type CreateEmailTokenData = {
  token: string;
  userId: string;
  expiresAt: Date;
};

export type CreatePasswordResetTokenData = {
  token: string; // Le hachage du jeton
  userId: string;
  expiresAt: Date;
  createdAt: Date;
};

/**
 * Interface pour l'abstraction de la persistance des jetons temporaires.
 */
export interface ITokenRepository {
  // --- Email Verification Tokens ---
  createEmailVerificationToken(
    data: CreateEmailTokenData,
  ): Promise<EmailVerificationToken>;

  findEmailVerificationTokenByToken(
    tokenValue: string,
  ): Promise<EmailVerificationToken | null>;

  deleteEmailVerificationTokenById(id: string): Promise<void>;

  // --- Password Reset Tokens ---

  createPasswordResetToken(
    data: CreatePasswordResetTokenData,
  ): Promise<PasswordResetToken>;

  findAllActiveResetTokens(): Promise<PasswordResetToken[]>;

  deletePasswordResetTokenById(id: string): Promise<void>;
}
