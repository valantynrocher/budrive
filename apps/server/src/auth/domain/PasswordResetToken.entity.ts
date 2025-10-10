export class PasswordResetToken {
  private id: string;
  private token: string;
  private userId: string;
  private expiresAt: Date;
  private createdAt: Date;

  constructor(data: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.token = data.token;
    this.userId = data.userId;
    this.expiresAt = data.expiresAt;
    this.createdAt = data.createdAt;
  }

  // --- Getters (Accesseurs) ---
  public getId(): string {
    return this.id;
  }
  public getTokenHash(): string {
    return this.token;
  }
  public getUserId(): string {
    return this.userId;
  }
  public getExpiresAt(): Date {
    return this.expiresAt;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }

  // Méthodes Métier
  public isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
