import { PrismaModule } from "@/shared/infrastructure/prisma/prisma.module";
import { UserService } from "@/contexts/User/application/User.service";
import { USER_REPOSITORY } from "@/contexts/User/domain";
import { PrismaUserRepository } from "@/contexts/User/infrastructure/persistence/PrismaUser.repository";
import { UserController } from "@/contexts/User/infrastructure/User.controller";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserService, USER_REPOSITORY],
})
export class UserModule {}
