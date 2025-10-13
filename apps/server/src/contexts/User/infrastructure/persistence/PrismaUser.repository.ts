import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import {
  IUserRepository,
  User,
  UserCreationData,
} from "@/contexts/User/domain"; // Importe du Domain
import { Injectable } from "@nestjs/common";
import type { User as PrismaUser } from "@prisma/client";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Fonction utilitaire pour convertir le type Prisma en Entity DDD
  private toDomain(prismaRecord: PrismaUser): User {
    return new User(prismaRecord);
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
