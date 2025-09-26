export type VehicleContextType = {
  vehicleId: string | null;
  selectVehicle: (id: string | null) => void;
};
