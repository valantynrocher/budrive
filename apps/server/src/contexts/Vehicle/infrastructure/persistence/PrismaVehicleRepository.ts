import {
  Vehicle,
  type VehicleEntityProps,
} from "@/contexts/Vehicle/domain/Vehicle.entity";
import { IVehicleRepository } from "@/contexts/Vehicle/domain/VehicleRepository.interface";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { FuelType } from "@budrive/validation";
import { Injectable } from "@nestjs/common";
import { Vehicle as PrismaVehicle } from "@prisma/client";

@Injectable()
export class PrismaVehicleRepository implements IVehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  // --- Méthode de Mapping ---
  private toDomain(prismaVehicle: PrismaVehicle): Vehicle {
    const domainProps: VehicleEntityProps = {
      id: prismaVehicle.id,
      userId: prismaVehicle.userId,
      make: prismaVehicle.make,
      model: prismaVehicle.model,
      mileage: prismaVehicle.mileage,
      licensePlate: prismaVehicle.licensePlate,
      yearOfCirculation: prismaVehicle.yearOfCirculation,
      fuelType: prismaVehicle.fuelType as FuelType,
      createdAt: prismaVehicle.createdAt,
      updatedAt: prismaVehicle.updatedAt,
    };
    return Vehicle.fromPersistence(domainProps);
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    const data = vehicle.toPrimitives();

    // On utilise `upsert` pour gérer la création et la mise à jour
    const prismaVehicle = await this.prisma.vehicle.upsert({
      where: { id: data.id !== "tempo" ? data.id : "" },
      update: data,
      create: {
        ...data,
        id: undefined, // Laisse Prisma générer l'ID pour la création
      },
    });

    return this.toDomain(prismaVehicle);
  }

  async findByUserId(userId: string): Promise<Vehicle[]> {
    const prismaVehicles = await this.prisma.vehicle.findMany({
      where: { userId },
    });
    return prismaVehicles.map(this.toDomain);
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    const prismaVehicle = await this.prisma.vehicle.findUnique({
      where: { licensePlate },
    });

    return prismaVehicle ? this.toDomain(prismaVehicle) : null;
  }
}
