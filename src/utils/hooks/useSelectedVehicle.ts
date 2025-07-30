import { useParams } from "next/navigation";

export type SelectedVehicleParams = {
  vehicle_id?: string;
};

const useSelectedVehicle = () => {
  const { vehicle_id } = useParams<SelectedVehicleParams>();

  return vehicle_id;
};

export default useSelectedVehicle;
