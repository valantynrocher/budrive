import { type FuelType, type OnboardingStep1Dto } from "@budrive/validation";

/**
 * Propriétés brutes de l'entité Vehicle.
 */
export interface VehicleEntityProps {
  id: string;
  userId: string;
  make: string;
  model: string;
  mileage: number;
  licensePlate: string;
  yearOfCirculation: number;
  fuelType: FuelType;
  createdAt: Date;
  updatedAt: Date;
}

export class Vehicle {
  private props: VehicleEntityProps;

  // forcer l'utilisation des méthodes Factory (create, fromRepo)
  private constructor(props: VehicleEntityProps) {
    this.props = props;
  }

  /**
   * Méthode Factory pour créer une nouvelle instance (lors de l'Onboarding).
   */
  public static create(data: OnboardingStep1Dto, userId: string): Vehicle {
    const now = new Date();
    const initialProps: VehicleEntityProps = {
      id: "tempo",
      userId,
      make: data.make,
      model: data.model,
      mileage: data.mileage,
      licensePlate: data.licensePlate,
      yearOfCirculation: data.yearOfCirculation,
      fuelType: data.fuelType,
      createdAt: now,
      updatedAt: now,
    };
    return new Vehicle(initialProps);
  }

  /**
   * Méthode Factory pour reconstruire l'entité à partir de la base de données.
   */
  public static fromPersistence(props: VehicleEntityProps): Vehicle {
    return new Vehicle(props);
  }

  // --- Getters ---
  public getId(): string {
    return this.props.id;
  }
  public getUserId(): string {
    return this.props.userId;
  }
  public getMake(): string {
    return this.props.make;
  }
  public getModel(): string {
    return this.props.model;
  }
  public getMileage(): number {
    return this.props.mileage;
  }
  public getLicensePlate(): string | undefined {
    return this.props.licensePlate;
  }
  public getYearOfCirculation(): number {
    return this.props.yearOfCirculation;
  }
  public getFuelType(): string {
    return this.props.fuelType;
  }
  public getCreatedAt(): Date {
    return this.props.createdAt;
  }
  public getUpdatedAd(): Date {
    return this.props.updatedAt;
  }

  // Renvoie toutes les propriétés pour la persistance ou les DTOs
  public toPrimitives(): VehicleEntityProps {
    return { ...this.props };
  }
}
