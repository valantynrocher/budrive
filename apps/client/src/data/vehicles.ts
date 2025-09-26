import { vehicleSchema } from "@/utils/types/vehicles";

export const myVehicles = [
  vehicleSchema.parse({
    id: "ee3f6f12-a05c-400e-a6e6-c863b2dd4bf1",
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

export const getVehicleById = (id?: string) =>
  id ? myVehicles.find((vehicle) => vehicle.id === id) : undefined;
