import { z } from "zod";

export enum FuelType {
  GASOLINE = "GASOLINE",
  DIESEL = "DIESEL",
  ELECTRIC = "ELECTRIC",
  HYBRID = "HYBRID",
  OTHER = "OTHER",
}

export const FuelTypeSchema = z.nativeEnum(FuelType);
