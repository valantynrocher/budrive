import { AuthErrors } from "@/common/errors";
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

class AuthCredentialsDto {
  @IsNotEmpty({
    message: AuthErrors.EMAIL_REQUIRED,
  })
  @IsEmail(undefined, {
    message: AuthErrors.EMAIL_INVALID,
  })
  email: string;

  @IsNotEmpty({
    message: AuthErrors.PASSWORD_REQUIRED,
  })
  @MinLength(8, {
    message: AuthErrors.PASSWORD_TOO_SHORT,
  })
  password: string;
}

export class SignUpDto extends AuthCredentialsDto {
  @IsNotEmpty({
    message: AuthErrors.PASSWORD_REQUIRED,
  })
  @MinLength(8, {
    message: AuthErrors.PASSWORD_TOO_SHORT,
  })
  confirmPassword: string;

  @IsOptional()
  fullName?: string;
}

export class SignInDto extends AuthCredentialsDto {}

export class ConfirmDto {
  @IsNotEmpty({
    message: AuthErrors.TOKEN_REQUIRED,
  })
  token: string;
}
