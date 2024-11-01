// src/application/services/message.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { ConversationRepository } from "../../domain/conversation/repositories/conversation.repository";
import { ConversationId } from "../../domain/conversation/value-objects/conversation-id";
import { Message } from "../../domain/messages/entities/message.entity";
import { MessageRepository } from "../../domain/messages/repositories/message.repository";
import { MessageContent } from "../../domain/messages/value-objects/message-content";
import { MessageId } from "../../domain/messages/value-objects/message-id";
import { MessageStatus, MessageStatusType } from "../../domain/messages/value-objects/message-status";
import { UserRepository } from "../../domain/user/repositiories/user.repository";
import { UserId } from "../../domain/user/value-objects/user-id";
import { SendMessageCommand } from "../commands/send-message.command";

export interface SendMessageDto {
  messageId?: string;
  content: string;
  senderId: string;
  conversationId: string;
  timestamp?: Date;
  localMessageId: string;
}

export interface GetMessagesDto {
  conversationId: string;
  limit?: number;
  before?: Date;
}

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly userRepository: UserRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async sendMessage(dto: SendMessageDto): Promise<Message> {
    try {
      const sender = await this.userRepository.findById(new UserId(dto.senderId));
      if (!sender) {
        throw new Error("Sender not found");
      }

      const message = new Message(
        dto.messageId ? new MessageId(dto.messageId) : MessageId.generate(),
        sender,
        new ConversationId(dto.conversationId),
        new MessageContent(dto.content),
        MessageStatus.create(MessageStatusType.SENT),
        dto.timestamp || new Date(),
        dto.localMessageId,
      );

      return await this.messageRepository.save(message);
    } catch (error) {
      this.logger.error(`Failed to send message: ${error.message}`);
      throw error;
    }
  }

  async getConversationMessages(dto: GetMessagesDto): Promise<Message[]> {
    try {
      const conversationId = new ConversationId(dto.conversationId);
      const conversation = await this.conversationRepository.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      return await this.messageRepository.findByConversationId(conversationId);
    } catch (error) {
      this.logger.error(`Failed to get conversation messages: ${error.message}`);
      throw error;
    }
  }
}
