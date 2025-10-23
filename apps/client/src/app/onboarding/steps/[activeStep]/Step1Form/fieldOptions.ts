import { FuelType } from "@budrive/validation";

/**
 * YEAR
 */
const maxYear = new Date().getFullYear(); // 2025
export const minYear = maxYear - 20; // 2005

const generateYears = (): number[] => {
  const years: number[] = [];
  for (let year = maxYear; year >= minYear; year--) {
    years.push(year);
  }
  return years;
};

export const yearsOptions = generateYears();

/**
 * FUEL TYPE
 */
interface FuelOption {
  value: FuelType;
  label: string;
}

export const fuelOptions: FuelOption[] = [
  { value: FuelType.GASOLINE, label: "Essence" },
  { value: FuelType.DIESEL, label: "Diesel" },
  { value: FuelType.ELECTRIC, label: "Électrique" },
  { value: FuelType.HYBRID, label: "Hybride / Hybride Rechargeable" },
  { value: FuelType.OTHER, label: "Autre (GPL, Bioéthanol, etc.)" },
];
