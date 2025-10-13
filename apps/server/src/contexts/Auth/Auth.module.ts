import { MailModule } from "@/infrastructure/services/mail/mail.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../User/User.module";
import { AuthService } from "./application/Auth.service";
import { TokenManagementService } from "./application/TokenManagement.service";
import { AuthController } from "./infrastructure/Auth.controller";
import { JwtStrategy } from "./infrastructure/strategies/Jwt.strategy";
import { TOKEN_REPOSITORY } from "@/contexts/Auth/domain/TokenRepository.interface";
import { PrismaTokenRepository } from "@/contexts/Auth/infrastructure/persistence/PrismaToken.repository";

@Module({
  imports: [
    UserModule,
    MailModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: config.get<string>("JWT_EXPIRES_IN") },
      }),
    }),
  ],
  providers: [
    AuthService,
    TokenManagementService,
    JwtStrategy,
    {
      provide: TOKEN_REPOSITORY,
      useClass: PrismaTokenRepository,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
