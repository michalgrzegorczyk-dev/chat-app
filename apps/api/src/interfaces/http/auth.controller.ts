// src/interfaces/http/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../../infrastructure/security/guards/jwt-auth.guard";
import { AuthService } from "../../application/auth/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: { username: string; password: string }) {
    return await this.authService.login(loginDto);
  }

  @Post("refresh")
  async refreshTokens(@Body() body: { userId: string; refreshToken: string }) {
    return await this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return { message: "Successfully logged out" };
  }
}
