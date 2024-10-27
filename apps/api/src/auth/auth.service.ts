import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { SupabaseService } from "../chat/supabase.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supa: SupabaseService,
  ) {}

  async login(loginDto: { username: string; password: string }) {
    return this.supa.login({ email: loginDto.username, password: loginDto.password });
  }
}
