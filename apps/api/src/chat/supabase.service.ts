import { ConversationDetailsDto, ConversationListElementDto, MemberDto, MessageDto, SendMessageRequestDto } from "@chat-app/dtos";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { MessageDbModel } from "./model/conversation.model";

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private jwtService: JwtService) {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }

  // async getConversationsByUserId(userId: string): Promise<ConversationListElementDto[]> {
  //   const { data } = await this.supabase
  //     .from('conversationuser')
  //     .select(`
  //           conversation_id,
  //           conversation:conversation_id(name, avatar_url, chat_type, last_message, last_message_timestamp, last_message_sender_id),
  //           other_user:conversation_id(users!inner(id, name, profile_photo_url))
  //       `)
  //     .eq('user_id', userId)
  //     .neq('other_user.users.id', userId);
  //
  //   return data.map((item: any) => {
  //     const isOneOnOne = item.conversation.chat_type === 'single';
  //
  //     return {
  //       conversationId: item.conversation_id,
  //       avatarUrl: isOneOnOne ? item.other_user.users[0].profile_photo_url : item.conversation.avatar_url,
  //       name: isOneOnOne ? item.other_user.users[0].name : item.conversation.name,
  //       chatType: item.conversation.chat_type,
  //       lastMessageContent: item.conversation.last_message,
  //       lastMessageTimestamp: item.conversation.last_message_timestamp,
  //       lastMessageSenderId: item.conversation.last_message_sender_id
  //     };
  //   }).sort((a, b) => b.lastMessageTimestamp.localeCompare(a.lastMessageTimestamp));
  // }

  async login(loginDto: { email: string; password: string }) {
    try {
      // Query the users table
      const { data: user } = await this.supabase
        .from("users")
        .select("id, name, email, profile_photo_url")
        .eq("email", loginDto.email)
        .eq("password", loginDto.password) // Note: In production, use proper password hashing
        .single();

      const payload = {
        email: user.email,
        sub: user.id,
        name: user.name,
        profile_photo_url: user.profile_photo_url,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_photo_url: user.profile_photo_url,
        },
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid credentials");
    }
  }

  async getConversationsByUserId(userId: string): Promise<ConversationListElementDto[]> {
    try {
      const { data, error } = await this.supabase
        .from("conversationuser")
        .select(
          `
        conversation_id,
        conversation:conversation_id(
          name,
          avatar_url,
          last_message,
          last_message_timestamp
        ),
        other_user:conversation_id(users!inner(id, name, profile_photo_url)),
        last_message:conversation_id(
          message(sender_id)
        )
      `,
        )
        .eq("user_id", userId)
        .neq("other_user.users.id", userId)
        .order("conversation(last_message_timestamp)", { ascending: false });

      if (error) {
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conversations: ConversationListElementDto[] = data.map((item: any) => {
        const otherUser = item.other_user.users[0];
        const lastMessage = item.last_message.message[0];

        return {
          conversationId: item.conversation_id,
          avatarUrl: otherUser?.profile_photo_url,
          name: otherUser?.name,
          lastMessageContent: item.conversation.last_message || "",
          lastMessageTimestamp: item.conversation.last_message_timestamp || "",
          lastMessageSenderId: lastMessage?.sender_id || "",
        };
      });
      return conversations;
    } catch (error) {
      return [];
    }
  }

  async saveMessage(message: SendMessageRequestDto): Promise<MessageDto> {
    const { data } = await this.supabase
      .from("message")
      .insert({
        conversation_id: message.conversationId,
        local_message_id: message.localMessageId,
        sender_id: message.userId,
        content: message.content,
        created_at: message.timestamp,
        status: "sent",
      })
      .select()
      .single();

    return data;
  }

  async getConversation(userId: string, conversationId: string): Promise<ConversationDetailsDto> {
    const data = await this.supabase
      .from("message")
      .select(
        `
              id,
              content,
              created_at,
              sender:users(name, id, profile_photo_url),
              conversation:conversation!inner(id)
            `,
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    //TODO: check how to type objects from supabase etc.
    // const conversationListDb: ConversationDbModel[] = data as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messageListDb: MessageDbModel[] = data.data as any;

    return {
      conversationId: conversationId,
      messageList: messageListDb.map((msg) => ({
        message_id: String(msg.id),
        content: msg.content,
        created_at: msg.created_at,
        sender_id: String(msg.sender.id),
        status: "sent", //todo
      })),
      memberList: this.getUniqueSenders(messageListDb),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUniqueSenders(data: any): MemberDto[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Array.from(new Map(data.map((msg: any) => [msg.sender.id, msg.sender])).values()) as MemberDto[];
  }

  //todo remove after auth implementation
  async getAllUsers() {
    const { data } = await this.supabase.from("users").select("*");
    return data;
  }

  async updateConversationList(sendMessageDto: SendMessageRequestDto): Promise<void> {
    await this.supabase
      .from("conversation")
      .update({
        last_message: sendMessageDto.content,
        last_message_timestamp: sendMessageDto.timestamp,
        last_message_sender_id: sendMessageDto.userId,
      })
      .eq("id", sendMessageDto.conversationId);
  }

  async getUserIdListFromConversation(conversationId: string): Promise<string[]> {
    const { data } = await this.supabase.from("conversationuser").select("user_id").eq("conversation_id", conversationId);
    return data.map((item) => item.user_id);
  }

  async updateMessages(userId, conversationId, queue) {
    const { data } = await this.supabase
      .from("message")
      .upsert({
        conversation_id: conversationId,
        local_message_id: queue.localMessageId,
        sender_id: userId,
        content: queue.content,
        created_at: queue.timestamp,
        status: "sending",
      })
      .eq("conversation_id", conversationId)
      .eq("sender_id", userId);
    return data;
  }
}
