import { SelectedVehicleParams } from "@/utils/hooks/useSelectedVehicle";
import React from "react";

interface InsurancePageProps {
  params: SelectedVehicleParams;
}

const InsurancePage = ({ params }: InsurancePageProps) => {
  const { vehicle_id } = params;

  return (
    <div>
      Consultez ici vos contrats d&apos;assurance du véhicule sélectionné :{" "}
      {vehicle_id}
    </div>
  );
};

export default InsurancePage;
