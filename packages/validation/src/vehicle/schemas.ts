import { z } from "zod";

export enum FuelType {
  GASOLINE = "GASOLINE",
  DIESEL = "DIESEL",
  ELECTRIC = "ELECTRIC",
  HYBRID = "HYBRID",
  OTHER = "OTHER",
}

export const FuelTypeSchema = z.nativeEnum(FuelType);

export const Step1VehicleSchema = z.object({
  make: z.string().min(2, "La marque est obligatoire").max(50),
  model: z.string().min(1, "Le modèle est obligatoire").max(100),
  mileage: z.number().int().min(0, "Le kilométrage ne peut pas être négatif"),
  licensePlate: z.string(),
  yearOfCirculation: z.number().int().min(1900).max(new Date().getFullYear()),
  fuelType: FuelTypeSchema,
});

export type Step1VehicleDto = z.infer<typeof Step1VehicleSchema>;
