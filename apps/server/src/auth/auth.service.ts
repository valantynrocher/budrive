import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from 'src/auth/dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  async signIn(credentials: SignInDto) {
    const user = await this.usersService.findByEmail(credentials.email);

    if (!user) {
      throw new UnauthorizedException(
        "Il n'existe aucun utilisateur avec cet e-mail",
      );
    }

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.passwordHash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Le mot de passe est incorrect');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }
}
