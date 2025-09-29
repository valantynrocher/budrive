import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(credentials: SignUpDto) {
    const existingUser = await this.usersService.findByEmail(credentials.email);

    if (existingUser) {
      throw new ConflictException(
        'Cet e-mail est déjà utilisé par un utilisateur.',
      );
    }

    const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const passwordHash = await bcrypt.hash(credentials.password, SALT_ROUNDS);

    const user = await this.usersService.create({
      email: credentials.email,
      passwordHash,
      fullName: credentials?.fullName,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _ph, ...safeUser } = user;
    return safeUser;
  }
}
