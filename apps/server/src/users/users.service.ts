import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(payload: {
    email: string;
    passwordHash: string;
    fullName?: string | null;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: payload.email,
        passwordHash: payload.passwordHash,
        fullName: payload.fullName,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }
}
