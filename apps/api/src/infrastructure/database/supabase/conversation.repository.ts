// src/infrastructure/database/supabase/conversation.repository.ts
import { ConversationDetailsDto, ConversationListElementDto, MemberDto } from "@chat-app/dtos";
import { Injectable, Logger } from "@nestjs/common";

import { SupabaseService } from "../../../chat/supabase.service";
import { Conversation } from "../../../domain/conversation/entities/conversation.entity";
import { ConversationRepository } from "../../../domain/conversation/repositories/conversation.repository";
import { ConversationId } from "../../../domain/conversation/value-objects/conversation-id";
import { ConversationType } from "../../../domain/conversation/value-objects/conversation-type";
import { Message } from "../../../domain/messages/entities/message.entity";
import { MessageContent } from "../../../domain/messages/value-objects/message-content";
import { MessageId } from "../../../domain/messages/value-objects/message-id";
import { MessageStatus } from "../../../domain/messages/value-objects/message-status";
import { User } from "../../../domain/user/entities/user.entity";
import { Email } from "../../../domain/user/value-objects/email";
import { UserId } from "../../../domain/user/value-objects/user-id";

interface SupabaseConversationResponse {
  conversation_id: string;
  conversation: {
    name: string;
    avatar_url: string;
    last_message: string;
    last_message_timestamp: string;
  };
  other_user: {
    users: Array<{
      id: string;
      name: string;
      email: string;
      profile_photo_url: string;
    }>;
  };
  last_message: {
    message: Array<{
      id: string;
      sender_id: string;
      content: string;
      status: string;
      created_at: string;
    }>;
  };
}

interface SupabaseMessageResponse {
  id: string;
  content: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    profile_photo_url: string | null;
  };
  conversation: {
    id: string;
  };
}

@Injectable()
export class SupabaseConversationRepository implements ConversationRepository {
  private readonly logger = new Logger(SupabaseConversationRepository.name);

  constructor(private readonly supabase: SupabaseService) {}

  async findByUserId(userId: string): Promise<Conversation[]> {
    // Fixed return type
    try {
      const { data, error } = await this.supabase.supabase
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
        other_user:conversation_id(
          users!inner(id, name, email, profile_photo_url)
        ),
        last_message:conversation_id(
          message(id, sender_id, content, status, created_at)
        )
      `,
        )
        .eq("user_id", userId)
        .neq("other_user.users.id", userId);

      if (error) {
        this.logger.error(`Error fetching conversations: ${error.message}`);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      const conversations: Conversation[] = [];

      for (const rawItem of data) {
        const item = rawItem as unknown as SupabaseConversationResponse;
        try {
          const otherUser = item.other_user.users[0];
          const lastMessageData = item.last_message?.message?.[0];

          const members = [
            new User(new UserId(userId), "Current User", new Email("user@example.com"), null),
            new User(new UserId(otherUser.id), otherUser.name, new Email(otherUser.email), otherUser.profile_photo_url),
          ];

          const conversation = new Conversation(
            new ConversationId(item.conversation_id),
            item.conversation.name,
            ConversationType.DIRECT,
            members,
            item.conversation.avatar_url,
          );

          if (lastMessageData) {
            const sender = members.find((m) => m.getId() === lastMessageData.sender_id) || members[0];
            const message = new Message(
              new MessageId(lastMessageData.id),
              sender,
              new ConversationId(item.conversation_id),
              new MessageContent(lastMessageData.content),
              MessageStatus.create(lastMessageData.status || "SENT"),
              new Date(lastMessageData.created_at),
            );
            conversation.addMessage(message);
          }

          conversations.push(conversation);
        } catch (error) {
          this.logger.error(`Error processing conversation: ${error.message}`);
          // Continue with next conversation
          continue;
        }
      }

      return conversations;
    } catch (error) {
      this.logger.error("Error fetching conversations:", error);
      return [];
    }
  }

  async findById(conversationId: ConversationId): Promise<ConversationDetailsDto> {
    try {
      const { data, error } = await this.supabase.supabase
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
        .eq("conversation_id", conversationId.getValue())
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch conversation: ${error.message}`);
      }

      const messages = data as unknown as SupabaseMessageResponse[];

      return {
        conversationId: conversationId.getValue(),
        messageList: messages.map((msg) => ({
          message_id: msg.id,
          content: msg.content,
          created_at: msg.created_at,
          sender_id: msg.sender.id,
          status: "sent",
        })),
        memberList: this.getUniqueSenders(messages),
      };
    } catch (error) {
      this.logger.error(`Error in findById: ${error.message}`);
      throw error;
    }
  }

  async getParticipants(conversationId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase.supabase.from("conversationuser").select("user_id").eq("conversation_id", conversationId);

      if (error) {
        throw new Error(`Failed to get participants: ${error.message}`);
      }

      return data.map((row) => row.user_id);
    } catch (error) {
      this.logger.error(`Error getting participants: ${error.message}`);
      throw error;
    }
  }

  async getUserConversations(userId: string): Promise<ConversationListElementDto[]> {
    console.log("ZZZZ");
    try {
      const { data, error } = await this.supabase.supabase
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

  // async getUserConversations(userId: string): Promise<ConversationListElementDto[]> {
  //   try {
  //     const { data, error } = await this.supabase.supabase
  //       .from("conversationuser")
  //       .select(
  //         `
  //         conversation_id,
  //         conversation:conversation_id(
  //           name,
  //           avatar_url,
  //           last_message,
  //           last_message_timestamp
  //         ),
  //         other_user:conversation_id(
  //           users!inner(id, name, profile_photo_url)
  //         ),
  //         last_message:conversation_id(
  //           message(sender_id)
  //         )
  //       `,
  //       )
  //       .eq("user_id", userId)
  //       .neq("other_user.users.id", userId);
  //
  //     console.log(data);
  //
  //     if (error) {
  //       this.logger.error(`Error fetching conversations: ${error.message}`);
  //       return [];
  //     }
  //
  //     return (data || []).map((item: any) => ({
  //       conversationId: item.conversation_id,
  //       avatarUrl: item.other_user?.users[0]?.profile_photo_url || item.conversation.avatar_url,
  //       name: item.other_user?.users[0]?.name || item.conversation.name,
  //       lastMessageContent: item.conversation.last_message || "",
  //       lastMessageTimestamp: item.conversation.last_message_timestamp || "",
  //       lastMessageSenderId: item.last_message?.message[0]?.sender_id || "",
  //     }));
  //   } catch (error) {
  //     this.logger.error(`Error in getUserConversations: ${error.message}`);
  //     return [];
  //   }
  // }

  async updateLastMessage(
    conversationId: ConversationId,
    lastMessage: {
      messageId: string;
      content: string;
      senderId: string;
      timestamp: Date;
    },
  ): Promise<void> {
    try {
      const { error } = await this.supabase.supabase
        .from("conversation")
        .update({
          last_message: lastMessage.content,
          last_message_timestamp: lastMessage.timestamp.toISOString(),
          last_message_sender_id: lastMessage.senderId,
        })
        .eq("id", conversationId.getValue());

      if (error) {
        throw new Error(`Failed to update last message: ${error.message}`);
      }
    } catch (error) {
      this.logger.error(`Error updating last message: ${error.message}`);
      throw error;
    }
  }

  private getUniqueSenders(messages: SupabaseMessageResponse[]): MemberDto[] {
    return Array.from(
      new Map(
        messages.map((msg) => [
          msg.sender.id,
          {
            id: msg.sender.id,
            name: msg.sender.name,
            profile_photo_url: msg.sender.profile_photo_url,
          },
        ]),
      ).values(),
    );
  }

  async save(conversation: Conversation): Promise<void> {
    throw new Error("Method not implemented");
  }

  async update(conversation: Conversation): Promise<void> {
    throw new Error("Method not implemented");
  }
}
