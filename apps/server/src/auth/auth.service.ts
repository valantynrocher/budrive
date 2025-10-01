import { AuthErrors } from "@/common/errors";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { SignInDto, SignUpDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(credentials: SignUpDto) {
    const existingUser = await this.usersService.findByEmail(credentials.email);

    if (existingUser) {
      throw new ConflictException(AuthErrors.EMAIL_ALREADY_EXISTS);
    }

    if (credentials.password !== credentials.confirmPassword) {
      throw new BadRequestException(AuthErrors.CONFIRM_PASSWORD_NOT_MATCH);
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
      throw new UnauthorizedException(AuthErrors.INVALID_CREDENTIALS);
    }

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.passwordHash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException(AuthErrors.INVALID_CREDENTIALS);
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }
}
