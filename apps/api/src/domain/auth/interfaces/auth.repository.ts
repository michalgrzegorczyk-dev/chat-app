import { AuthToken } from "../entities/auth-token.entity";

export const AUTH_REPOSITORY = "AUTH_REPOSITORY";

export interface AuthRepository {
  login(email: string, password: string): Promise<AuthToken>;
  refreshToken(userId: string, refreshToken: string): Promise<AuthToken>;
  logout(userId: string): Promise<void>;
  validateToken(token: string): Promise<boolean>;
}
