import { SelectedVehicleParams } from "@/utils/hooks/useSelectedVehicle";
import React from "react";

interface DocumentsPageProps {
  params: SelectedVehicleParams;
}

const DocumentsPage = ({ params }: DocumentsPageProps) => {
  const { vehicle_id } = params;

  return (
    <div>
      Consultez ici les documents liés au véhicule sélectionné : {vehicle_id}
    </div>
  );
};

export default DocumentsPage;
