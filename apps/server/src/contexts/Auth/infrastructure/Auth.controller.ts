import { ZodValidationPipe } from "@/shared/infrastructure/common/zod/zod-validation.pipe";
import {
  AuthErrors,
  AuthSuccess,
  AuthToken,
  type ConfirmDto,
  ConfirmSchema,
  type ForgotPwdDto,
  ForgotPwdSchema,
  type ResetPwdDto,
  ResetPwdSchema,
  type SignInDto,
  SignInSchema,
  type SignUpDto,
  SignUpSchema,
} from "@budrive/validation";
import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { type Request, type Response } from "express";
import { AuthService } from "../application/Auth.service";
import { JwtAuthGuard } from "./guards/JwtAuth.guard";
import { clearAuthCookies, setAuthCookies } from "./utils/Auth.cookies";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger("AuthController");

  @Post("sign-up")
  async signUp(
    @Body(new ZodValidationPipe(SignUpSchema)) signUpDto: SignUpDto,
  ) {
    return this.authService.signUp(signUpDto);
  }

  @Post("confirm")
  async confirm(
    @Body(new ZodValidationPipe(ConfirmSchema)) confirmDto: ConfirmDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.confirm(confirmDto);

    setAuthCookies(res, accessToken, refreshToken);

    return {
      success: true,
      message: AuthSuccess.CONFIRM,
    };
  }

  @Post("sign-in")
  async signIn(
    @Body(new ZodValidationPipe(SignInSchema)) signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInDto);

    setAuthCookies(res, accessToken, refreshToken);

    return {
      success: true,
      message: AuthSuccess.SIGN_IN,
    };
  }

  @Post("refresh")
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[AuthToken.REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedException(AuthErrors.RESRESH_TOKEN_MISSING);
    }

    // Décoder le JWT sans le vérifier pour extraire le userId (sub)
    const payload = this.jwtService.decode(refreshToken) as {
      sub: string;
      exp: number;
    };

    if (!payload || !payload.sub) {
      clearAuthCookies(res);
      throw new UnauthorizedException(AuthErrors.REFRESH_TOKEN_INVALID);
    }

    try {
      // Appelle le service pour valider l'ancien RT et générer de nouveaux tokens
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshTokens(payload.sub, refreshToken);

      // Définition des NOUVEAUX cookies
      setAuthCookies(res, accessToken, newRefreshToken);

      return { success: true, message: AuthSuccess.REFRESH };
    } catch (e) {
      // En cas d'échec (token invalide/révoqué), on nettoie les cookies et lève l'exception 401
      clearAuthCookies(res);
      throw new UnauthorizedException(AuthErrors.REFRESH_FAILED);
    }
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // Le contrôleur récupère l'ID utilisateur du contexte d'exécution (Guard)
    const userId = req.user!.sub;

    // Le service gère la révocation en DB
    await this.authService.logout(userId);

    // Le contrôleur gère la suppression des cookies
    clearAuthCookies(res);

    return { success: true, message: AuthSuccess.LOGOUT };
  }

  @Post("forgot-password")
  async forgotPassword(
    @Body(new ZodValidationPipe(ForgotPwdSchema)) credentials: ForgotPwdDto,
  ) {
    return this.authService.forgotPassword(credentials);
  }

  @Get("verify-reset-token")
  async verifyResetToken(@Query("token") token: string) {
    await this.authService.verifyResetToken(token);

    return {
      status: "ok",
    };
  }

  @Post("reset-password")
  async resetPassword(
    @Body(new ZodValidationPipe(ResetPwdSchema)) credentials: ResetPwdDto,
  ) {
    return await this.authService.resetPassword(credentials);
  }
}
