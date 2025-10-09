import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
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
}
