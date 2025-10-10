import { EmailVerificationToken } from "./EmailVerificationToken.entity";
import { PasswordResetToken } from "./PasswordResetToken.entity";

export const TOKEN_REPOSITORY = "ITokenRepository";

// Type de données minimales pour créer un jeton de vérification
export type CreateEmailTokenData = {
  token: string;
  userId: string;
  expiresAt: Date;
};

// Type de données minimales pour créer un jeton de réinitialisation
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

  // Nous devons trouver par tous les tokens valides pour la comparaison de hachage
  findAllActiveResetTokens(): Promise<PasswordResetToken[]>;

  deletePasswordResetTokenById(id: string): Promise<void>;
}
