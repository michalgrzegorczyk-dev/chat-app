import { Injectable } from "@nestjs/common";
import { MessageRepository } from "../../../domain/messages/repositories/message.repository";
import { Message } from "../../../domain/messages/entities/message.entity";
import { SupabaseService } from "../../../chat/supabase.service";
import { ConversationId } from "../../../domain/conversation/value-objects/conversation-id";
import { MessageId } from "../../../domain/messages/value-objects/message-id";
import { MessageStatus } from "../../../domain/messages/value-objects/message-status";

@Injectable()
export class SupabaseMessageRepository implements MessageRepository {
  constructor(private readonly supabase: SupabaseService) {}

  async save(message: Message): Promise<Message> {
    const { data } = await this.supabase.supabase
      .from("message")
      .insert({
        id: message.getId().toString(),
        conversation_id: message.getConversationId().getValue(),
        sender_id: message.getSender().getId(),
        content: message.getContent(),
        created_at: message.getCreatedAt().toISOString(),
        status: message.getStatus().getValue(),
      })
      .select()
      .single();

    return message;
  }

  async findByConversationId(conversationId: ConversationId): Promise<Message[]> {
    const { data } = await this.supabase.supabase
      .from("message")
      .select(
        `
        id,
        content,
        created_at,
        status,
        sender:sender_id(id, name, email, profile_photo_url)
      `,
      )
      .eq("conversation_id", conversationId.getValue())
      .order("created_at", { ascending: true });

    return []; // You'll need to map the data to Message entities
  }

  async updateStatus(messageId: MessageId, status: MessageStatus): Promise<void> {
    await this.supabase.supabase.from("message").update({ status: status.getValue() }).eq("id", messageId.toString());
  }
}
