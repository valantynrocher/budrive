import { EmailVerificationTokensService } from "@/email-verification-tokens/email-verification-tokens.service";
import { MailService } from "@/mail/mail.service";
import { PasswordResetTokenService } from "@/password-reset-token/password-reset-token.service";
import {
  AuthErrors,
  ResetPwdDto,
  type ConfirmDto,
  type ForgotPwdDto,
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
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly emailVerificationService: EmailVerificationTokensService,
    private readonly passwordResetService: PasswordResetTokenService,
    private readonly prisma: PrismaService,
  ) {}

  private async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      // Access Token
      this.jwtService.signAsync(
        { sub: userId },
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
      ),
      // Refresh Token
      this.jwtService.signAsync(
        { sub: userId },
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  // Hache le Refresh Token et le stocke en DB (pour comparaison ultérieure)
  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.usersService.updatehashedRefreshToken(
      userId,
      hashedRefreshToken,
    );
  }

  private async createPasswordHash(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new BadRequestException(AuthErrors.CONFIRM_PASSWORD_NOT_MATCH);
    }

    const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return passwordHash;
  }

  async signUp(credentials: SignUpDto) {
    const existingUser = await this.usersService.findByEmail(credentials.email);

    if (existingUser) {
      throw new ConflictException(AuthErrors.EMAIL_ALREADY_EXISTS);
    }

    const passwordHash = await this.createPasswordHash(
      credentials.password,
      credentials.confirmPassword,
    );

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

    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
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

    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, oldRefreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.hashedRefreshToken) {
      // Session révoquée ou jamais établie
      throw new UnauthorizedException("Accès refusé. Session non trouvée.");
    }

    // 1. Comparaison du token reçu (oldRefreshToken) avec le hachage en DB
    const isRefreshTokenValid = await bcrypt.compare(
      oldRefreshToken,
      user.hashedRefreshToken,
    );

    if (!isRefreshTokenValid) {
      // Mesure de sécurité : Si le token est invalide, on révoque tous les tokens (faille)
      await this.usersService.updatehashedRefreshToken(userId, null);
      throw new UnauthorizedException("Token de rafraîchissement invalide.");
    }

    // 2. Génération de NOUVEAUX tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user.id);

    // 3. Stockage du hachage du NOUVEAU Refresh Token (Rotation des Tokens)
    await this.updateRefreshToken(user.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string) {
    // Supprimer le hachage du token pour révoquer la session
    await this.usersService.updatehashedRefreshToken(userId, null);
  }

  async forgotPassword(credentials: ForgotPwdDto) {
    const user = await this.usersService.findByEmail(credentials.email);

    if (!user) {
      return;
    }

    // 1. Création du jeton dans le service dédié
    const { tokenValue } = await this.passwordResetService.createForUser(
      user.id,
    );

    // 3. Envoi de l'email
    await this.mailService.sendPasswordReset(user.email, tokenValue);

    return;
  }

  async verifyResetToken(token: string) {
    await this.passwordResetService.validateToken(token);

    return;
  }

  async resetPassword(credentials: ResetPwdDto) {
    const resetToken = await this.passwordResetService.validateToken(
      credentials.token,
    );

    const passwordHash = await this.createPasswordHash(
      credentials.password,
      credentials.confirmPassword,
    );

    let updatedUser;

    try {
      // 3. Exécution de la Transaction
      await this.prisma.$transaction(async (tx) => {
        updatedUser = await tx.user.update({
          where: { id: resetToken.userId },
          data: { passwordHash: passwordHash },
        });

        await tx.passwordResetToken.delete({
          where: { id: resetToken.id },
        });
      });

      // 4. Actions Post-Transaction (Si tout a réussi)
      await this.mailService.sendPasswordResetConfirm(updatedUser.email);

      const { passwordHash: _ph, ...safeUser } = updatedUser;
      return safeUser;
    } catch (error) {
      // rollback
      console.error(
        "Erreur de transaction lors du reset du mot de passe :",
        error,
      );
      throw error;
    }
  }
}
