import { Vehicle } from "./Vehicle.entity";

export const VEHICLE_REPOSITORY = "VEHICLE_REPOSITORY";

export interface IVehicleRepository {
  /**
   * Sauvegarde une nouvelle entité Vehicle ou met à jour une entité existante.
   * @param vehicle L'entité Vehicle à persister.
   */
  save(vehicle: Vehicle): Promise<Vehicle>;

  /**
   * Récupère la liste des véhicules d'un utilisateur.
   * @param userId L'identifiant de l'utilisateur.
   */
  findByUserId(userId: string): Promise<Vehicle[]>;

  /**
   * Récupère un Vehicle par son identifiant unique.
   * @param id L'identifiant du véhicule.
   */
  findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
}
