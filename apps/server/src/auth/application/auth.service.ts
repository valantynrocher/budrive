import { TokenManagementService } from "@/auth/application/token-management.service";
import { MailService } from "@/infrastructure/services/mail/mail.service";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { UsersService } from "@/users/application/users.service";
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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly tokenManagementService: TokenManagementService,
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
    const existingUser = await this.usersService.findUserByEmail(
      credentials.email,
    );

    if (existingUser) {
      throw new ConflictException(AuthErrors.EMAIL_ALREADY_EXISTS);
    }

    const passwordHash = await this.createPasswordHash(
      credentials.password,
      credentials.confirmPassword,
    );

    const user = await this.usersService.registerUser({
      email: credentials.email,
      passwordHash,
      fullName: credentials?.fullName,
    });

    const emailToken =
      await this.tokenManagementService.createEmailVerificationTokenForUser(
        user.getId(),
      );

    await this.mailService.sendEmailConfirmation(
      user.getEmail(),
      emailToken.getToken(),
    );

    return {
      id: user.getId(),
      email: user.getEmail(),
      fullName: user.getFullName(),
    };
  }

  async confirm(payload: ConfirmDto) {
    const emailToken =
      await this.tokenManagementService.findEmailVerificationToken(
        payload.token,
      );
    if (!emailToken || emailToken.getExpiresAt() < new Date()) {
      throw new BadRequestException(AuthErrors.TOKEN_INVALID_EXPIRED);
    }

    const user = await this.usersService.verify(emailToken.getUserId());

    await this.tokenManagementService.deleteEmailVerificationTokenById(
      emailToken.getId(),
    );

    const { accessToken, refreshToken } = await this.generateTokens(
      user.getId(),
    );
    await this.updateRefreshToken(user.getId(), refreshToken);

    return { accessToken, refreshToken };
  }

  async signIn(credentials: SignInDto) {
    const user = await this.usersService.findUserByEmail(credentials.email);

    if (!user) {
      throw new UnauthorizedException(AuthErrors.INVALID_CREDENTIALS);
    }

    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.getPasswordHash(),
    );

    if (!passwordMatch) {
      throw new UnauthorizedException(AuthErrors.INVALID_CREDENTIALS);
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      user.getId(),
    );
    await this.updateRefreshToken(user.getId(), refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, oldRefreshToken: string) {
    const user = await this.usersService.findUserById(userId);

    if (!user || !user.getHashedRefreshToken()) {
      // Session révoquée ou jamais établie
      throw new UnauthorizedException("Accès refusé. Session non trouvée.");
    }

    // 1. Comparaison du token reçu (oldRefreshToken) avec le hachage en DB
    const isRefreshTokenValid = await bcrypt.compare(
      oldRefreshToken,
      user.getHashedRefreshToken() || "",
    );

    if (!isRefreshTokenValid) {
      // Mesure de sécurité : Si le token est invalide, on révoque tous les tokens (faille)
      await this.usersService.updatehashedRefreshToken(userId, null);
      throw new UnauthorizedException("Token de rafraîchissement invalide.");
    }

    // 2. Génération de NOUVEAUX tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user.getId());

    // 3. Stockage du hachage du NOUVEAU Refresh Token (Rotation des Tokens)
    await this.updateRefreshToken(user.getId(), newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string) {
    // Supprimer le hachage du token pour révoquer la session
    await this.usersService.updatehashedRefreshToken(userId, null);
  }

  async forgotPassword(credentials: ForgotPwdDto) {
    const user = await this.usersService.findUserByEmail(credentials.email);

    if (!user) {
      return;
    }

    // 1. Création du jeton dans le service dédié
    const { tokenValue } =
      await this.tokenManagementService.createPasswordResetTokenForUser(
        user.getId(),
      );

    // 3. Envoi de l'email
    await this.mailService.sendPasswordReset(user.getEmail(), tokenValue);

    return;
  }

  async verifyResetToken(token: string) {
    await this.tokenManagementService.validatePasswordResetToken(token);

    return;
  }

  async resetPassword(credentials: ResetPwdDto) {
    const resetToken =
      await this.tokenManagementService.validatePasswordResetToken(
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
          where: { id: resetToken.getUserId() },
          data: { passwordHash: passwordHash },
        });

        await tx.passwordResetToken.delete({
          where: { id: resetToken.getId() },
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
