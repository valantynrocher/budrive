import { PrismaService } from "@/prisma/prisma.service";
import { AuthErrors } from "@budrive/validation";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PasswordResetToken, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";

@Injectable()
export class PasswordResetTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createForUser(userId: User["id"]) {
    const tokenValue = randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(tokenValue, 10);
    await this.prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
        createdAt: new Date(Date.now()),
      },
    });

    return { tokenValue };
  }

  async validateToken(token: string) {
    const activeTokens = await this.prisma.passwordResetToken.findMany({
      where: { expiresAt: { gt: new Date() } },
    });

    for (const resetToken of activeTokens) {
      const isMatch = await bcrypt.compare(token, resetToken.token);

      if (isMatch) {
        return resetToken;
      }
    }

    throw new NotFoundException(AuthErrors.RESET_PWD_TOKEN_NO_FOUND);
  }

  async deleteById(id: PasswordResetToken["id"]) {
    return await this.prisma.passwordResetToken.delete({
      where: { id },
    });
  }
}
