// @Injectable()
// export class SupabaseUserRepository implements UserRepository {
//   constructor(private supabase: SupabaseClient) {}
//
//   async findByEmail(email: Email): Promise<User | null> {
//     const { data } = await this.supabase.from("users").select("*").eq("email", email.getValue()).single();
//
//     if (!data) return null;
//
//     return new User(new UserId(data.id), data.name, new Email(data.email), data.profile_photo_url);
//   }
//
//   async findById(id: UserId): Promise<User | null> {
//     const { data } = await this.supabase.from("users").select("*").eq("id", id.getValue()).single();
//
//     if (!data) return null;
//
//     return new User(new UserId(data.id), data.name, new Email(data.email), data.profile_photo_url);
//   }
// }
