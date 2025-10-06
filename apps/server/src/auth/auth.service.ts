import {
  AuthErrors,
  type ConfirmDto,
  type SignInDto,
  type SignUpDto,
} from "@budrive/validation";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { MailService } from "@/mail/mail.service";
import { EmailVerificationTokensService } from "@/email-verification-tokens/email-verification-tokens.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly emailVerificationService: EmailVerificationTokensService,
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

    const { token } = await this.emailVerificationService.createForUser(
      user.id,
    );

    await this.mailService.sendEmailConfirmation(user.email, token);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _ph, ...safeUser } = user;
    return safeUser;
  }

  async confirm(payload: ConfirmDto) {
    const record = await this.emailVerificationService.findByToken(
      payload.token,
    );
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException(AuthErrors.TOKEN_INVALID_EXPIRED);
    }

    const user = await this.usersService.verifyUser(record.userId);

    await this.emailVerificationService.deleteById(record.id);

    const accessToken = this.jwtService.sign({ sub: user.id });

    return accessToken;
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
