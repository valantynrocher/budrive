import { z } from "zod";
import { FuelTypeSchema, LICENSE_PLATE_REGEX } from "../vehicle";
import { OnboardingStatus } from "./types";
import { OnboardingErrors } from "./messages";

export const OnboardingStatusSchema = z.nativeEnum(OnboardingStatus);

export const OnboardingInfosSchema = z.object({
  onboardingStatus: OnboardingStatusSchema,
  onboardingStep: z.number(),
});
export type OnboardingInfosDto = z.infer<typeof OnboardingInfosSchema>;

export const OnboardingStep1Schema = z.object({
  make: z.string().min(2, OnboardingErrors.MAKE_REQUIRED),
  model: z.string().min(2, OnboardingErrors.MODEL_REQUIRED),
  licensePlate: z
    .string()
    .regex(LICENSE_PLATE_REGEX, OnboardingErrors.LICENSE_PLATE_INVALID),
  mileage: z.coerce.number().min(1, OnboardingErrors.MILEAGE_MINIMUM_VALUE),
  yearOfCirculation: z.coerce
    .number()
    .int()
    .min(1900, OnboardingErrors.YEAR_CIRCULATION_INVALID)
    .max(new Date().getFullYear(), OnboardingErrors.YEAR_CIRCULATION_INVALID),
  fuelType: FuelTypeSchema,
  name: z.string().optional(),
});

export type OnboardingStep1Dto = z.infer<typeof OnboardingStep1Schema>;

const AcceptedAnnualMileageLiterals = z.union([
  z.literal(4000),
  z.literal(7500),
  z.literal(12500),
  z.literal(17500),
  z.literal(25000),
]);
export type AcceptedAnnualMileageLiterals = z.infer<
  typeof AcceptedAnnualMileageLiterals
>;
export const OnboardingStep2Schema = z.object({
  purchaseDate: z
    .date()
    .min(new Date("2025-01-01"), OnboardingErrors.PURCHASE_DATE_INVALID)
    .max(new Date(), OnboardingErrors.PURCHASE_DATE_INVALID),
  purchasePrice: z.coerce.number().min(1),
  initialMileage: z.coerce
    .number()
    .min(1, OnboardingErrors.MILEAGE_MINIMUM_VALUE),
  estimatedAnnualMileage: AcceptedAnnualMileageLiterals.pipe(
    z.number({
      required_error: "Le kilométrage annuel est requis.",
    })
  ),
});
export type OnboardingStep2Dto = z.infer<typeof OnboardingStep2Schema>;
