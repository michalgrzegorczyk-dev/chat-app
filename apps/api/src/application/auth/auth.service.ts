import { Injectable, Inject } from "@nestjs/common";
import { AUTH_REPOSITORY, AuthRepository } from "../../domain/auth/interfaces/auth.repository";
import { AuthResponseDto } from "./dtos/auth-response.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepository,
  ) {}

  async login(loginDto: { username: string; password: string }): Promise<AuthResponseDto> {
    const authToken = await this.authRepository.login(loginDto.username, loginDto.password);

    return {
      access_token: authToken.getAccessToken(),
      refresh_token: authToken.getRefreshToken(),
      user: {
        id: authToken.getUserId(),
        name: authToken.getUserName(),
        profile_photo_url: authToken.getUserProfilePhotoUrl() || null,
      },
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const authToken = await this.authRepository.refreshToken(userId, refreshToken);

    return {
      accessToken: authToken.getAccessToken(),
      refreshToken: authToken.getRefreshToken(),
    };
  }

  async logout(userId: string): Promise<void> {
    await this.authRepository.logout(userId);
  }
}
