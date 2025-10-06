import { ZodValidationPipe } from "@/common/zod/zod-validation.pipe";
import { Body, Controller, Post, Res } from "@nestjs/common";
import { type Response } from "express";
import {
  type ConfirmDto,
  ConfirmSchema,
  type SignInDto,
  SignInSchema,
  type SignUpDto,
  SignUpSchema,
  AuthToken,
} from "@budrive/validation";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    const accessToken = await this.authService.confirm(confirmDto);

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    res.cookie(AuthToken.NAME, accessToken, {
      httpOnly: true, // Empêche l'accès au JS côté client (Sécurité XSS CRUCIALE)
      secure: process.env.NODE_ENV === "production", // Cookie envoyé uniquement en HTTPS en production
      sameSite: "strict", // Protège contre le CSRF
      expires: expirationDate, // Date d'expiration
      // domain: 'votre-domaine.com', // Optionnel si vous gérez des sous-domaines
    });

    return {
      success: true,
      message: AuthToken.CONFIRM_SUCCESS,
    };
  }

  @Post("sign-in")
  signIn(@Body(new ZodValidationPipe(SignInSchema)) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
