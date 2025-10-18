export const VehicleErrors = {
  LICENSE_PLATE_CONFLICT:
    "Cette immatriculation est déjà attribuée à un véhicule",
};
export type VehicleErrorKey = keyof typeof VehicleErrors;

export const VehicleSuccess = {};
export type VehicleSuccessKey = keyof typeof VehicleSuccess;
