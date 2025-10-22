import { z } from "zod";
import { FuelTypeSchema } from "../vehicle";
import { OnboardingStatus } from "./types";

export const OnboardingStatusSchema = z.nativeEnum(OnboardingStatus);

export const OnboardingInfosSchema = z.object({
  onboardingStatus: OnboardingStatusSchema,
  onboardingStep: z.number(),
});
export type OnboardingInfosDto = z.infer<typeof OnboardingInfosSchema>;

export const OnboardingStep1Schema = z.object({
  make: z.string().min(2, "La marque est obligatoire").max(50),
  model: z.string().min(1, "Le modèle est obligatoire").max(100),
  licensePlate: z.string(),
  mileage: z.number(),
  yearOfCirculation: z.number().int().min(1900).max(new Date().getFullYear()),
  fuelType: FuelTypeSchema,
  name: z.string().optional(),
});

export type OnboardingStep1Dto = z.infer<typeof OnboardingStep1Schema>;
