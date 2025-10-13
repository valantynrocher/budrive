import { EmailVerificationToken } from "@/contexts/Auth/domain/EmailVerificationToken.entity";
import { PasswordResetToken } from "@/contexts/Auth/domain/PasswordResetToken.entity";
import {
  CreateEmailTokenData,
  CreatePasswordResetTokenData,
  ITokenRepository,
} from "@/contexts/Auth/domain/TokenRepository.interface";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import type {
  EmailVerificationToken as PrismaEmailVerificationToken,
  PasswordResetToken as PrismaPasswordResetToken,
} from "@prisma/client";

@Injectable()
export class PrismaTokenRepository implements ITokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Fonction utilitaire pour convertir le type Prisma en Entity DDD
  private toEmailTokenDomain(
    prismaRecord: PrismaEmailVerificationToken,
  ): EmailVerificationToken {
    return new EmailVerificationToken(prismaRecord);
  }

  // Fonction utilitaire pour convertir le type Prisma en Entity DDD
  private toPasswordTokenDomain(
    prismaRecord: PrismaPasswordResetToken,
  ): PasswordResetToken {
    return new PasswordResetToken(prismaRecord);
  }

  async createEmailVerificationToken(
    data: CreateEmailTokenData,
  ): Promise<EmailVerificationToken> {
    const prismaRecord = await this.prisma.emailVerificationToken.create({
      data,
    });
    return this.toEmailTokenDomain(prismaRecord);
  }

  async findEmailVerificationTokenByToken(
    token: string,
  ): Promise<EmailVerificationToken | null> {
    const prismaRecord = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
    });
    return prismaRecord ? this.toEmailTokenDomain(prismaRecord) : null;
  }

  async deleteEmailVerificationTokenById(id: string): Promise<void> {
    await this.prisma.emailVerificationToken.delete({
      where: { id },
    });
    return;
  }

  async createPasswordResetToken(
    data: CreatePasswordResetTokenData,
  ): Promise<PasswordResetToken> {
    const prismaRecord = await this.prisma.passwordResetToken.create({
      data,
    });
    return this.toPasswordTokenDomain(prismaRecord);
  }

  async findAllActiveResetTokens(): Promise<PasswordResetToken[]> {
    const activeRecords = await this.prisma.passwordResetToken.findMany({
      where: { expiresAt: { gt: new Date() } },
    });
    return activeRecords.map((aR) => this.toPasswordTokenDomain(aR));
  }

  async deletePasswordResetTokenById(id: string): Promise<void> {
    await this.prisma.passwordResetToken.delete({
      where: { id },
    });
    return;
  }
}
