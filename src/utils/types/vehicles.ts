import { Tables } from "@/utils/supabase/types/database";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const vehicleSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => uuidv4()),
  fuel: z.string(),
  make: z.string(),
  model: z.string(),
  mileage: z.number(),
  year: z.number(),
  created_at: z.string(),
  user_id: z.string(),
  logo_marque: z.string().url(),
  registration: z.string(),
});

export type VehicleData = z.infer<typeof vehicleSchema>;
export type VehicleId = VehicleData["id"] & { __brand: "vehicleId" };

export const _checkType: Tables<"vehicles"> = {} as VehicleData;
