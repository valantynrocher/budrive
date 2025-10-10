export class EmailVerificationToken {
  private id: string;
  private token: string;
  private userId: string;
  private expiresAt: Date;

  constructor(data: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
  }) {
    this.id = data.id;
    this.token = data.token;
    this.userId = data.userId;
    this.expiresAt = data.expiresAt;
  }

  // --- Getters (Accesseurs) ---
  public getId(): string {
    return this.id;
  }
  public getToken(): string {
    return this.token;
  }
  public getUserId(): string {
    return this.userId;
  }
  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  // Méthodes Métier
  public isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
