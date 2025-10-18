import { OnboardingService } from "@/contexts/User/application/Onboarding.service";
import { UserService } from "@/contexts/User/application/User.service";
import { USER_REPOSITORY } from "@/contexts/User/domain";
import { OnboardingController } from "@/contexts/User/infrastructure/Onboarding.controller";
import { PrismaUserRepository } from "@/contexts/User/infrastructure/persistence/PrismaUser.repository";
import { UserController } from "@/contexts/User/infrastructure/User.controller";
import { VehicleModule } from "@/contexts/Vehicle/Vehicle.module";
import { PrismaModule } from "@/shared/infrastructure/prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, VehicleModule],
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
