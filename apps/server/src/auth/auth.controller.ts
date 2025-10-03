import { ZodValidationPipe } from "@/common/zod/zod-validation.pipe";
import { Body, Controller, Post } from "@nestjs/common";
import {
  type ConfirmDto,
  ConfirmSchema,
  type SignInDto,
  SignInSchema,
  type SignUpDto,
  SignUpSchema,
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
  confirm(@Body(new ZodValidationPipe(ConfirmSchema)) confirmDto: ConfirmDto) {
    return this.authService.confirm(confirmDto);
  }

  @Post("sign-in")
  signIn(@Body(new ZodValidationPipe(SignInSchema)) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
