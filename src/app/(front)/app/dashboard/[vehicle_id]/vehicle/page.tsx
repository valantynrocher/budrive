import { SelectedVehicleParams } from "@/utils/hooks/useSelectedVehicle";
import React from "react";

interface VehiclePageProps {
  params: SelectedVehicleParams;
}

const VehiclePage = ({ params }: VehiclePageProps) => {
  const { vehicle_id } = params;

  return <div>Information sur le véhicule sélectionné : {vehicle_id}</div>;
};

export default VehiclePage;
