import { OnboardingStatus } from "@budrive/validation";

interface UserMinimalProps {
  email: string;
  passwordHash: string;
}

export interface UserEntityProps extends UserMinimalProps {
  id: string;
  fullName: string | null;
  isVerified: boolean;
  hashedRefreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  onboardingStatus: OnboardingStatus;
  onboardingStep: number;
}

export class User {
  private props: UserEntityProps;

  private constructor(props: UserEntityProps) {
    this.props = props;
  }

  private setUpdatedAt() {
    this.props.updatedAt = new Date();
  }

  public static create(data: UserMinimalProps): User {
    const now = new Date();
    const initialProps: UserEntityProps = {
      id: "tempo",
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: null,
      isVerified: false,
      hashedRefreshToken: null,
      createdAt: now,
      updatedAt: now,
      onboardingStatus: OnboardingStatus.PENDING,
      onboardingStep: 0,
    };

    return new User(initialProps);
  }

  public static fromPersistence(props: UserEntityProps): User {
    return new User(props);
  }

  public toPrimitives(): UserEntityProps {
    return { ...this.props };
  }

  // --- Getters (Accesseurs) ---
  public getId(): string {
    return this.props.id;
  }
  public getEmail(): string {
    return this.props.email;
  }
  public getPasswordHash(): string {
    return this.props.passwordHash;
  }
  public isVerifiedUser(): boolean {
    return this.props.isVerified;
  }
  public getHashedRefreshToken(): string | null {
    return this.props.hashedRefreshToken;
  }
  public getFullName(): string | null {
    return this.props.fullName;
  }
  public getCreatedAt(): Date {
    return this.props.createdAt;
  }
  public getUpdatedt(): Date {
    return this.props.updatedAt;
  }
  public getOnboardingStatus(): OnboardingStatus {
    return this.props.onboardingStatus;
  }
  public getOnboardingStep(): number {
    return this.props.onboardingStep;
  }

  // --- Méthodes Métier ---
  public verify(): void {
    if (this.props.isVerified) {
      // Optionnel: lever une erreur si déjà vérifié
      return;
    }
    this.props.isVerified = true;
    this.setUpdatedAt();
  }

  public updatePassword(newPasswordHash: string): void {
    this.props.passwordHash = newPasswordHash;
    this.setUpdatedAt();
  }

  public setRefreshTokenHash(hash: string | null): void {
    this.props.hashedRefreshToken = hash;
    this.setUpdatedAt();
  }

  public isOnboardingCompleted(): boolean {
    return this.props.onboardingStatus === OnboardingStatus.COMPLETED;
  }

  public updateOnboardingStep(step: number): void {
    this.props.onboardingStep = step;
    this.props.onboardingStatus = OnboardingStatus.IN_PROGRESS;
    this.setUpdatedAt();
  }

  public completeOnboarding(): void {
    this.props.onboardingStatus = OnboardingStatus.COMPLETED;
    this.setUpdatedAt();
  }

  public skipOnboarding(): void {
    this.props.onboardingStatus = OnboardingStatus.SKIPPED;
    this.setUpdatedAt();
  }
}
