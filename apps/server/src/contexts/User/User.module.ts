import { PrismaModule } from "@/shared/infrastructure/prisma/prisma.module";
import { UserService } from "@/contexts/User/application/User.service";
import { USER_REPOSITORY } from "@/contexts/User/domain";
import { PrismaUserRepository } from "@/contexts/User/infrastructure/persistence/PrismaUser.repository";
import { UserController } from "@/contexts/User/infrastructure/User.controller";
import { Module } from "@nestjs/common";
import { OnboardingController } from "@/contexts/User/infrastructure/Onboarding.controller";
import { OnboardingService } from "@/contexts/User/application/Onboarding.service";

@Module({
  imports: [PrismaModule],
  controllers: [UserController, OnboardingController],
  providers: [
    UserService,
    OnboardingService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserService, USER_REPOSITORY],
})
export class UserModule {}
