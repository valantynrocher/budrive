import { ZodValidationPipe } from "@/common/zod/zod-validation.pipe";
import {
  AuthErrors,
  AuthSuccess,
  AuthToken,
  type ConfirmDto,
  ConfirmSchema,
  type SignInDto,
  SignInSchema,
  type SignUpDto,
  SignUpSchema,
} from "@budrive/validation";
import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { type Request, type Response } from "express";
import { clearAuthCookies, setAuthCookies } from "./auth.cookies";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";

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
      message: AuthSuccess.USER_CONFIRMED,
    };
  }

  @Post("sign-in")
  signIn(@Body(new ZodValidationPipe(SignInSchema)) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
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

      return { success: true };
    } catch (e) {
      // En cas d'échec (token invalide/révoqué), on nettoie les cookies et lève l'exception 401
      clearAuthCookies(res);
      throw new UnauthorizedException(AuthErrors.SESSION_EXPIRED_INVALID);
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
}
