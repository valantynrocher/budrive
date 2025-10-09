import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { EmailVerificationTokensModule } from './email-verification-tokens/email-verification-tokens.module';
import { PasswordResetTokenModule } from './password-reset-token/password-reset-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    EmailVerificationTokensModule,
    PasswordResetTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
