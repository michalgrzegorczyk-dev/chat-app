import { Injectable } from "@nestjs/common";

import { SupabaseService } from "../../../chat/supabase.service";
import { User } from "../../../domain/user/entities/user.entity";
import { UserRepository } from "../../../domain/user/repositiories/user.repository";
import { Email } from "../../../domain/user/value-objects/email";
import { UserId } from "../../../domain/user/value-objects/user-id";

@Injectable()
export class SupabaseUserRepository implements UserRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async findById(id: UserId): Promise<User | null> {
    const { data } = await this.supabase.supabase.from("users").select("*").eq("id", id.getValue()).single();

    if (!data) return null;

    return new User(new UserId(data.id), data.name, new Email(data.email), data.profile_photo_url);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const { data } = await this.supabase.supabase.from("users").select("*").eq("email", email.getValue()).single();

    if (!data) return null;

    return new User(new UserId(data.id), data.name, new Email(data.email), data.profile_photo_url);
  }

  async save(user: User): Promise<User> {
    // Implementation for saving user
    return user;
  }
}
