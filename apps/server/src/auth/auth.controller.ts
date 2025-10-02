import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfirmDto, SignInDto, SignUpDto } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post("confirm")
  confirm(@Body() confirmDto: ConfirmDto) {
    return this.authService.confirm(confirmDto);
  }

  @Post("sign-in")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
