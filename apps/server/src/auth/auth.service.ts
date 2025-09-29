import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  async signUp(credentials: SignUpDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Cet e-mail est déjà utilisé par un utilisateur.',
      );
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: credentials.email,
        passwordHash: hashedPassword,
        fullName: credentials?.fullName,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
