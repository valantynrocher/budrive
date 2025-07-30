import { VehicleData, vehicleSchema } from "@/utils/types/vehicles";

export const myVehicles: VehicleData[] = [
  vehicleSchema.parse({
    fuel: "Diesel",
    make: "Peugeot",
    model: "207",
    mileage: 230000,
    year: 2009,
    created_at: "2020-01-01T00:00:00Z",
    user_id: "user1",
    logo_marque: "https://example.com/logo_peugeot.png",
    registration: "AZ542CE",
  }),
];
