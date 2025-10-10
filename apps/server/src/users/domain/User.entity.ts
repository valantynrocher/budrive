export class User {
  private id: string;
  private email: string;
  private passwordHash: string;
  private fullName: string | null;
  private isVerified: boolean;
  private hashedRefreshToken: string | null;
  private createdAt: Date;
  private updatedAt: Date;

  // IMPORTANT: Mappage des champs de Prisma vers l'entité
  constructor(data: {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string | null;
    isVerified: boolean;
    hashedRefreshToken: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.fullName = data.fullName;
    this.isVerified = data.isVerified;
    this.hashedRefreshToken = data.hashedRefreshToken;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt || data.createdAt;
  }

  // --- Getters (Accesseurs) ---
  public getId(): string {
    return this.id;
  }
  public getEmail(): string {
    return this.email;
  }
  public getPasswordHash(): string {
    return this.passwordHash;
  }
  public isVerifiedUser(): boolean {
    return this.isVerified;
  }
  public getHashedRefreshToken(): string | null {
    return this.hashedRefreshToken;
  }
  public getFullName(): string | null {
    return this.fullName;
  }

  // --- Méthodes Métier (Mutateurs d'état) ---

  public verify(): void {
    if (this.isVerified) {
      // Optionnel: lever une erreur si déjà vérifié
      return;
    }
    this.isVerified = true;
  }

  public updatePassword(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
    // Potentiel: Invalider le refresh token ici si la règle métier l'exige
  }

  public setRefreshTokenHash(hash: string | null): void {
    this.hashedRefreshToken = hash;
  }
}
