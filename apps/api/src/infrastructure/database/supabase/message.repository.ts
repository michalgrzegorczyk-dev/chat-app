// src/infrastructure/database/supabase/message.repository.ts
import { Injectable, Logger } from "@nestjs/common";
import { MessageRepository } from "../../../domain/messages/repositories/message.repository";
import { Message } from "../../../domain/messages/entities/message.entity";
import { SupabaseService } from "../../../chat/supabase.service";
import { ConversationId } from "../../../domain/conversation/value-objects/conversation-id";
import { MessageId } from "../../../domain/messages/value-objects/message-id";
import { MessageStatus } from "../../../domain/messages/value-objects/message-status";
import { MessageContent } from "../../../domain/messages/value-objects/message-content";
import { User } from "../../../domain/user/entities/user.entity";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { Email } from "../../../domain/user/value-objects/email";

interface MessageData {
  id: string;
  content: string;
  created_at: string;
  status: string;
  local_message_id: string;
  sender: {
    id: string;
    name: string;
    email: string;
    profile_photo_url: string | null;
  };
}

@Injectable()
export class SupabaseMessageRepository implements MessageRepository {
  private readonly logger = new Logger(SupabaseMessageRepository.name);

  constructor(private readonly supabase: SupabaseService) {}

  async save(message: Message): Promise<Message> {
    try {
      const messageData = {
        id: message.getId().toString(),
        local_message_id: message.getLocalMessageId(),
        conversation_id: message.getConversationId().getValue(),
        sender_id: message.getSender().getId(),
        content: message.getContent(),
        created_at: new Date(message.getCreatedAt()).toISOString(),
        status: message.getStatus().getValue(),
      };

      const { error } = await this.supabase.supabase.from("message").insert(messageData).select().single();

      if (error) {
        throw new Error(`Failed to save message: ${error.message}`);
      }

      return message;
    } catch (error) {
      this.logger.error(`Error saving message: ${error.message}`);
      throw error;
    }
  }

  async findByConversationId(conversationId: ConversationId): Promise<Message[]> {
    try {
      const { data, error } = await this.supabase.supabase
        .from("message")
        .select(
          `
          id,
          local_message_id,
          content,
          created_at,
          status,
          sender:sender_id(id, name, email, profile_photo_url)
        `,
        )
        .eq("conversation_id", conversationId.getValue())
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch messages: ${error.message}`);
      }

      // Type assertion for the response data
      const messageData = data as unknown as MessageData[];

      return messageData.map((item) => {
        const sender = new User(new UserId(item.sender.id), item.sender.name, new Email(item.sender.email), item.sender.profile_photo_url || undefined);

        return new Message(
          new MessageId(item.id),
          sender,
          conversationId,
          new MessageContent(item.content),
          MessageStatus.create(item.status),
          new Date(item.created_at), // Ensure date is properly parsed
          item.local_message_id,
        );
      });
    } catch (error) {
      this.logger.error(`Error fetching messages: ${error.message}`);
      throw error;
    }
  }

  async updateStatus(messageId: MessageId, status: MessageStatus): Promise<void> {
    try {
      const { error } = await this.supabase.supabase.from("message").update({ status: status.getValue() }).eq("id", messageId.toString());

      if (error) {
        throw new Error(`Failed to update message status: ${error.message}`);
      }
    } catch (error) {
      this.logger.error(`Error updating message status: ${error.message}`);
      throw error;
    }
  }
}
