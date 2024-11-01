import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthToken } from "../../../domain/auth/entities/auth-token.entity";
import { AuthRepository } from "../../../domain/auth/interfaces/auth.repository";

import { SupabaseService } from "./supabase.service";

interface UserData {
  id: string;
  email: string;
  name: string;
  profile_photo_url?: string;
  refresh_token?: string;
}

@Injectable()
export class SupabaseAuthRepository implements AuthRepository {
  private readonly logger = new Logger(SupabaseAuthRepository.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async login(email: string, password: string): Promise<AuthToken> {
    try {
      const { data: user, error } = await this.supabaseService.supabase
        .from("users")
        .select("id, name, email, profile_photo_url")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error || !user) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const tokens = await this.generateTokens(user);

      await this.supabaseService.supabase.from("users").update({ refresh_token: tokens.refreshToken }).eq("id", user.id);

      // Return new AuthToken with all user data
      return new AuthToken(
        tokens.accessToken,
        tokens.refreshToken,
        user.id,
        user.name,
        user.email,
        user.profile_photo_url || null, // Ensure null instead of undefined
      );
    } catch (error) {
      this.logger.error(`Authentication error: ${error.message}`);
      throw new UnauthorizedException("Invalid credentials");
    }
  }

  async refreshToken(userId: string, refreshToken: string): Promise<AuthToken> {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
      });

      const { data: user, error } = await this.supabaseService.supabase
        .from("users")
        .select("id, email, name, profile_photo_url, refresh_token")
        .eq("id", userId)
        .single();

      if (error || !user || user.refresh_token !== refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const tokens = await this.generateTokens(user);

      await this.supabaseService.supabase.from("users").update({ refresh_token: tokens.refreshToken }).eq("id", user.id);

      return new AuthToken(
        tokens.accessToken,
        tokens.refreshToken,
        user.id,
        user.name,
        user.email,
        user.profile_photo_url || null, // Ensure null instead of undefined
      );
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(userId: string): Promise<void> {
    try {
      const { error } = await this.supabaseService.supabase.from("users").update({ refresh_token: null }).eq("id", userId);

      if (error) {
        this.logger.error(`Logout failed: ${error.message}`);
        throw new Error("Failed to logout user");
      }
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`);
      throw new Error("Failed to logout user");
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || "your-secret-key",
      });
      return true;
    } catch (error) {
      this.logger.debug(`Token validation failed: ${error.message}`);
      return false;
    }
  }

  private async generateTokens(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
      profile_photo_url: user.profile_photo_url || null,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || "your-secret-key",
        expiresIn: "1m",
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
        expiresIn: "7d",
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
