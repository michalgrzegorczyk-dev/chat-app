import { User } from "../entities/user.entity";
import { Email } from "../value-objects/email";
import { UserId } from "../value-objects/user-id";

export const USER_REPOSITORY = "USER_REPOSITORY";

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<User>;
}