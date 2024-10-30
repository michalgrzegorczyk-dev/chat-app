// import { Injectable } from "@nestjs/common";
// import { SupabaseClient } from "@supabase/supabase-js";
//
// import { Conversation } from "../../../domain/conversation/entities/conversation.entity";
// import { ConversationRepository } from "../../../domain/conversation/repositories/conversation.repository";
// import { ConversationId } from "../../../domain/conversation/value-objects/conversation-id";
// import { ConversationType } from "../../../domain/conversation/value-objects/conversation-type";
// import { User } from "../../../domain/user/entities/user.entity";
//
// @Injectable()
// export class SupabaseConversationRepository implements ConversationRepository {
//   constructor(private supabase: SupabaseClient) {}
//
//   async findById(id: ConversationId): Promise<Conversation | null> {
//     const { data, error } = await this.supabase
//       .from("conversation")
//       .select(
//         `
//         id,
//         name,
//         avatar_url,
//         chat_type,
//         users:conversationuser(user_id)
//       `,
//       )
//       .eq("id", id.getValue())
//       .single();
//
//     if (error || !data) return null;
//
//     const members = await this.fetchUsers(data.users.map((u) => u.user_id));
//
//     return new Conversation(new ConversationId(data.id), data.name, data.chat_type as ConversationType, members, data.avatar_url);
//   }
//
//   async findByUserId(userId: string): Promise<Conversation[]> {
//     const { data, error } = await this.supabase
//       .from("conversationuser")
//       .select(
//         `
//         conversation:conversation_id(
//           id,
//           name,
//           avatar_url,
//           chat_type,
//           users:conversationuser(user_id)
//         )
//       `,
//       )
//       .eq("user_id", userId);
//
//     if (error || !data) return [];
//
//     return Promise.all(
//       data.map(async (item) => {
//         const conv = item.conversation;
//         const members = await this.fetchUsers(conv.users.map((u) => u.user_id));
//
//         return new Conversation(new ConversationId(conv.id), conv.name, conv.chat_type as ConversationType, members, conv.avatar_url);
//       }),
//     );
//   }
//
//   private async fetchUsers(userIds: string[]): Promise<User[]> {
//     const { data } = await this.supabase.from("users").select("id, name, profile_photo_url").in("id", userIds);
//
//     return data?.map((u) => new User(u.id, u.name, u.profile_photo_url)) ?? [];
//   }
// }
