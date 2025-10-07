import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express"; // Pour accéder aux cookies
import { AuthToken } from "@budrive/validation";
import { UsersService } from "@/users/users.service";

interface JwtPayload {
  sub: string; // With user id corresponding to the token
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      // 1. Read the secret to validate token's signature
      secretOrKey: process.env.JWT_SECRET!,

      // 2. Extract JWT from cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request.cookies[AuthToken.ACCESS_TOKEN_COOKIE_NAME];
          if (!token) {
            return null;
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
    });
  }

  /**
   * This method is called after that token has been checked (signature OK and non expired).
   */
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);

    if (!user) throw new UnauthorizedException();

    // Le payload est attaché à req.user
    return { sub: user.id };
  }
}
