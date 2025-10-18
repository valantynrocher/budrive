import {
  IUserRepository,
  User,
  UserCreationData,
  OnboardingStatus,
} from "@/contexts/User/domain";
import type { UserEntityProps } from "@/contexts/User/domain/User.entity";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import type { User as PrismaUser } from "@prisma/client";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Fonction utilitaire pour convertir le type Prisma en Entity DDD
  private toDomain(prismaRecord: PrismaUser): User {
    const domainProps: UserEntityProps = {
      id: prismaRecord.id,
      email: prismaRecord.email,
      passwordHash: prismaRecord.passwordHash,
      fullName: prismaRecord.fullName,
      isVerified: prismaRecord.isVerified,
      hashedRefreshToken: prismaRecord.hashedRefreshToken,
      createdAt: prismaRecord.createdAt,
      updatedAt: prismaRecord.updatedAt,
      onboardingStatus: prismaRecord.onboardingStatus as OnboardingStatus,
      onboardingStep: prismaRecord.onboardingStep as number,
    };

    return User.fromPersistence(domainProps);
  }

  async findById(id: string): Promise<User | null> {
    const prismaRecord = await this.prisma.user.findUnique({ where: { id } });
    return prismaRecord ? this.toDomain(prismaRecord) : null;
  }

  async findAll(): Promise<User[]> {
    const prismaRecords = await this.prisma.user.findMany();
    return prismaRecords.map((pU) => this.toDomain(pU));
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaRecord = await this.prisma.user.findUnique({
      where: { email },
    });
    return prismaRecord ? this.toDomain(prismaRecord) : null;
  }

  // ... Implémentation des autres finders

  async create(data: UserCreationData): Promise<User> {
    const prismaRecord = await this.prisma.user.create({ data });
    return this.toDomain(prismaRecord);
  }

  async save(user: User): Promise<User> {
    // 1. Traduire l'Entity DDD en données de mise à jour pour Prisma
    const dataToUpdate = {
      email: user.getEmail(),
      passwordHash: user.getPasswordHash(),
      isVerified: user.isVerifiedUser(),
      hashedRefreshToken: user.getHashedRefreshToken(),
      // ...
    };

    // 2. Utiliser Prisma pour la mise à jour
    const prismaRecord = await this.prisma.user.update({
      where: { id: user.getId() },
      data: dataToUpdate,
    });

    return this.toDomain(prismaRecord);
  }
}
