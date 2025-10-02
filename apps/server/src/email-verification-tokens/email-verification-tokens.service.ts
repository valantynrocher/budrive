import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { EmailVerificationToken, User } from "@prisma/client";
import { randomUUID } from "crypto";

@Injectable()
export class EmailVerificationTokensService {
  constructor(private readonly prisma: PrismaService) {}

  async createForUser(userId: User["id"]) {
    const token = randomUUID();
    return await this.prisma.emailVerificationToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      },
    });
  }

  async findByToken(token: EmailVerificationToken["token"]) {
    return await this.prisma.emailVerificationToken.findUnique({
      where: { token },
    });
  }

  async deleteById(id: EmailVerificationToken["id"]) {
    return await this.prisma.emailVerificationToken.delete({
      where: { id },
    });
  }
}
