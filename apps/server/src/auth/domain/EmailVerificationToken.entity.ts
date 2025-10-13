import { Token, TokenData } from "@/shared/domain/entities/Token.entity";

export class EmailVerificationToken extends Token {
  constructor(data: TokenData) {
    super(data);
  }
}
