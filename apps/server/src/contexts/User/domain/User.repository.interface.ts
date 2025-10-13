import { User } from "./User.entity";

// Ce type représente les données minimales pour créer un User
export type UserCreationData = {
  email: string;
  passwordHash: string;
  fullName?: string | null;
};

export const USER_REPOSITORY = "IUserRepository";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;

  // Le service d'application demande au repository de sauver l'entité.
  // La création et la mise à jour sont souvent unifiées en "save" ou "upsert"
  save(user: User): Promise<User>;
  create(data: UserCreationData): Promise<User>;
}
