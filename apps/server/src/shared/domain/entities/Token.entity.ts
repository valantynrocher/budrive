export type TokenData = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
};

export abstract class Token {
  protected id: string;
  protected token: string;
  protected userId: string;
  protected expiresAt: Date;

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
