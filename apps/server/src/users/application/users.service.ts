import { IUserRepository, User, USER_REPOSITORY } from "@/users/domain";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  /* istanbul ignore next */
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  /* istanbul ignore next */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  /* istanbul ignore next */
  async findAll() {
    return this.userRepository.findAll();
  }

  /* istanbul ignore next */
  async registerUser(data: {
    email: string;
    passwordHash: string;
    fullName?: string | null;
  }): Promise<User> {
    // 2. Le service d'application appelle le repository pour la création
    return this.userRepository.create(data);
  }

  async verify(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // 3. Appel de la méthode métier de l'Entité
    user.verify();

    // 4. Sauvegarde de l'état de l'Entité via le Repository
    return this.userRepository.save(user);
  }

  async updatehashedRefreshToken(
    id: string,
    hashedRefreshToken: string | null,
  ): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.setRefreshTokenHash(hashedRefreshToken);

    return this.userRepository.save(user);
  }

  async updatePasswordHash(
    id: User["id"],
    passwordHash: string,
  ): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.updatePassword(passwordHash);

    return this.userRepository.save(user);
  }
}
