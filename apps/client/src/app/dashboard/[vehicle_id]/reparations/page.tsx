import { SelectedVehicleParams } from "@/utils/hooks/useSelectedVehicle";
import React from "react";

interface RepairsPageProps {
  params: SelectedVehicleParams;
}

const RepairsPage = ({ params }: RepairsPageProps) => {
  const { vehicle_id } = params;

  return (
    <div>
      Suivez ici l&apos;entretien du véhicule sélectionné : {vehicle_id}
    </div>
  );
};

export default RepairsPage;
