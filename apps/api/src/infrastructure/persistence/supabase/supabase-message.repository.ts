// src/infrastructure/database/supabase/message.repository.ts
import { Injectable, Logger } from "@nestjs/common";
import { MessageRepository } from "../../../domain/message/repositories/message.repository.interface";
import { Message } from "../../../domain/message/entities/message.entity";
import { ConversationId } from "../../../domain/conversation/value-objects/conversation-id.value-object";
import { MessageId } from "../../../domain/message/value-objects/message-id.value-object";
import { MessageStatusValueObject } from "../../../domain/message/value-objects/message-status.value-object";
import { MessageContent } from "../../../domain/message/value-objects/message-content.value-object";
import { User } from "../../../domain/user/entities/user.entity";
import { UserId } from "../../../domain/user/value-objects/user-id.value-object";
import { Email } from "../../../domain/user/value-objects/email.value-object";
import { SupabaseService } from "./supabase.service";

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
          MessageStatusValueObject.create(item.status),
          new Date(item.created_at), // Ensure date is properly parsed
          item.local_message_id,
        );
      });
    } catch (error) {
      this.logger.error(`Error fetching messages: ${error.message}`);
      throw error;
    }
  }

  async updateStatus(messageId: MessageId, status: MessageStatusValueObject): Promise<void> {
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
