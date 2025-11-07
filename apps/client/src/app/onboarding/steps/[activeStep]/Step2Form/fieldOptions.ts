import { AcceptedAnnualMileageLiterals } from "@budrive/validation";

/**
 * ESTIMATED ANNUAL MILEAGE
 */

type EstimatedMileageOption = {
  value: AcceptedAnnualMileageLiterals;
  label: string;
};
export const estimatedMileageOptions: EstimatedMileageOption[] = [
  { label: "Moins de 5 000 km / an", value: 4000 },
  { label: "5 000 à 10 000 km / an", value: 7500 },
  { label: "10 000 à 15 000 km / an", value: 12500 },
  { label: "15 000 à 20 000 km / an", value: 17500 },
  { label: "Plus de 20 000 km / an", value: 25000 },
];
