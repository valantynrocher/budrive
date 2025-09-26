// routes.ts

import { VehicleMenuSection } from "@/utils/types/routes";

export const routes = {
  dashboardVehicleInfos: (id: string) => `/dashboard/${id}/infos`,
  dashboardVehicleAssurances: (id: string) => `/dashboard/${id}/assurances`,
  dashboardVehicleReparations: (id: string) => `/dashboard/${id}/reparations`,
  dashboardVehicleDocuments: (id: string) => `/dashboard/${id}/documents`,
  dashboardVehicleNotFoundCatchAll: (id: string, rest: string = "") =>
    `/dashboard/${id}/${rest}`,
};

// Pour matcher les routes avec un vehicle_id
export const vehicleRoutePatterns: RegExp[] = [
  /^\/app^\/dashboard\/[^/]+\/infos$/,
  /^\/app^\/dashboard\/[^/]+\/assurances$/,
  /^\/app^\/dashboard\/[^/]+\/reparations$/,
  /^\/app^\/dashboard\/[^/]+\/documents$/,
  /^\/app^\/dashboard\/[^/]+\/.+$/, // catch-all (not-found ou autre)
];

export const isVehicleRoute = (pathname: string): boolean => {
  return vehicleRoutePatterns.some((regex) => regex.test(pathname));
};

type VehicleId = string & { __brand: "vehicleId" };

export const buildVehicleSectionUrl = (
  section: VehicleMenuSection,
  vehicleId?: VehicleId | null
): string => {
  if (vehicleId) {
    return `/dashboard/${vehicleId}/${section}`;
  }

  return `/dashboard/${section}`;
};
