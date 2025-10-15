export enum OnboardingStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export class User {
  private id: string;
  private email: string;
  private passwordHash: string;
  private fullName: string | null;
  private isVerified: boolean;
  private hashedRefreshToken: string | null;
  private createdAt: Date;
  private updatedAt: Date;
  private onboardingStatus: OnboardingStatus;
  private onboardingStep: number;

  // IMPORTANT: Mappage des champs de Prisma vers l'entité
  constructor(data: {
    id: string;
    email: string;
    passwordHash: string;
    fullName?: string | null;
    isVerified?: boolean;
    hashedRefreshToken?: string | null;
    createdAt?: Date;
    updatedAt?: Date | null;
    onboardingStatus?: OnboardingStatus;
    onboardingStep?: number;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.fullName = data.fullName || null;
    this.isVerified = data.isVerified || false;
    this.hashedRefreshToken = data.hashedRefreshToken || null;
    this.createdAt = data.createdAt || new Date(Date.now());
    this.updatedAt = data.updatedAt || this.createdAt;
    this.onboardingStatus = data.onboardingStatus ?? OnboardingStatus.PENDING;
    this.onboardingStep = data.onboardingStep ?? 0;
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
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public getUpdatedt(): Date | null {
    return this.updatedAt;
  }
  public getOnboardingStatus(): OnboardingStatus {
    return this.onboardingStatus;
  }
  public getOnboardingStep(): number {
    return this.onboardingStep;
  }

  // --- Méthodes Métier ---
  public verify(): void {
    if (this.isVerified) {
      // Optionnel: lever une erreur si déjà vérifié
      return;
    }
    this.isVerified = true;
  }

  public updatePassword(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
  }

  public setRefreshTokenHash(hash: string | null): void {
    this.hashedRefreshToken = hash;
  }

  public isOnboardingCompleted(): boolean {
    return this.onboardingStatus === OnboardingStatus.COMPLETED;
  }

  public updateOnboardingStep(step: number): void {
    this.onboardingStep = step;
    this.onboardingStatus = OnboardingStatus.IN_PROGRESS;
  }

  public completeOnboarding(): void {
    this.onboardingStatus = OnboardingStatus.COMPLETED;
  }
}
