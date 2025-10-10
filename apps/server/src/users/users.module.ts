import { PrismaModule } from "@/shared/infrastructure/prisma/prisma.module";
import { UsersService } from "@/users/application/users.service";
import { USER_REPOSITORY } from "@/users/domain";
import { PrismaUserRepository } from "@/users/infrastructure/persistence/PrismaUser.repository";
import { UsersController } from "@/users/infrastructure/users.controller";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UsersService, USER_REPOSITORY],
})
export class UsersModule {}
