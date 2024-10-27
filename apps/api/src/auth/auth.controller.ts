import { Body, Controller, Post } from "@nestjs/common";

import { AuthService } from "./auth.service"; // Change this import

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto);
  }
}
