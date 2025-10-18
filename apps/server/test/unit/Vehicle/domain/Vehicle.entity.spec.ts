import { Vehicle } from "@/contexts/Vehicle/domain/Vehicle.entity";
import { Step1VehicleDto } from "@budrive/validation";

describe("Vehicle Entity (Domain rules)", () => {
  const mockUserId = "user-abc-123";
  const mockStep1Dto: Step1VehicleDto = {
    make: "Peugeot",
    model: "207",
    mileage: 233459,
    yearOfCirculation: 2009,
    fuelType: "GASOLINE",
    licensePlate: "AZ-542-CE",
  };

  it("should create a new Vehicle entity with correct initial properties", () => {
    const vehicle = Vehicle.create(mockStep1Dto, mockUserId);

    // Vérification des invariants d'initialisation
    expect(vehicle.getId()).toBe("tempo"); // ID temporaire avant DB
    expect(vehicle.getUserId()).toBe(mockUserId);

    // Vérification des données métier
    expect(vehicle.getMake()).toBe(mockStep1Dto.make);
    expect(vehicle.getMileage()).toBe(mockStep1Dto.mileage);
  });
});
