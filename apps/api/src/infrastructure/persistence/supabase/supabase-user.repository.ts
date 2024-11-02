import { Injectable } from "@nestjs/common";

import { User } from "../../../domain/user/entities/user.entity";
import { UserRepository } from "../../../domain/user/repositories/user.repository.interface";
import { Email } from "../../../domain/user/value-objects/email.value-object";
import { UserId } from "../../../domain/user/value-objects/user-id.value-object";

import { SupabaseService } from "./supabase.service";

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
