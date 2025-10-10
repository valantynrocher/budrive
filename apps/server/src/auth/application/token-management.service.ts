import { AuthErrors } from "@budrive/validation";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { randomBytes, randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import {
  ITokenRepository,
  TOKEN_REPOSITORY,
} from "@/auth/domain/TokenRepository.interface";

@Injectable()
export class TokenManagementService {
  constructor(
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async createEmailVerificationTokenForUser(userId: string) {
    const token = randomUUID();
    return await this.tokenRepository.createEmailVerificationToken({
      token,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    });
  }

  async findEmailVerificationToken(token: string) {
    return await this.tokenRepository.findEmailVerificationTokenByToken(token);
  }

  async deleteEmailVerificationTokenById(id: string) {
    return await this.tokenRepository.deleteEmailVerificationTokenById(id);
  }

  async createPasswordResetTokenForUser(userId: string) {
    const tokenValue = randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(tokenValue, 10);
    await this.tokenRepository.createPasswordResetToken({
      token: hashedToken,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      createdAt: new Date(Date.now()),
    });

    return { tokenValue };
  }

  async validatePasswordResetToken(token: string) {
    const activeTokens = await this.tokenRepository.findAllActiveResetTokens();

    for (const resetToken of activeTokens) {
      const isMatch = await bcrypt.compare(token, resetToken.getTokenHash());

      if (isMatch) {
        return resetToken;
      }
    }

    throw new NotFoundException(AuthErrors.RESET_PWD_TOKEN_NO_FOUND);
  }

  async deletePasswordResetTokenById(id: string) {
    return this.tokenRepository.deletePasswordResetTokenById(id);
  }
}
