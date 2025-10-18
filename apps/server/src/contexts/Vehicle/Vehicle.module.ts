import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { Module } from "@nestjs/common";
import { VehicleService } from "./application/Vehicle.service";
import { VEHICLE_REPOSITORY } from "./domain/VehicleRepository.interface";
import { PrismaVehicleRepository } from "./infrastructure/persistence/PrismaVehicleRepository";

@Module({
  controllers: [],
  providers: [
    PrismaService,
    VehicleService,
    {
      provide: VEHICLE_REPOSITORY,
      useClass: PrismaVehicleRepository,
    },
  ],
  exports: [VehicleService],
})
export class VehicleModule {}
