import { z } from "zod";
import { VehicleErrors } from "./messages";

export enum FuelType {
  GASOLINE = "GASOLINE",
  DIESEL = "DIESEL",
  ELECTRIC = "ELECTRIC",
  HYBRID = "HYBRID",
  OTHER = "OTHER",
}

export const FuelTypeSchema = z.nativeEnum(FuelType, {
  message: VehicleErrors.FUEL_TYPE_UNKNOW,
});
