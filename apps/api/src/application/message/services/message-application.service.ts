// src/application/services/message.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { ConversationRepository } from "../../../domain/conversation/repositories/conversation.repository";
import { ConversationId } from "../../../domain/conversation/value-objects/conversation-id.value-object";
import { Message } from "../../../domain/message/entities/message.entity";
import { MessageRepository } from "../../../domain/message/repositories/message.repository.interface";
import { MessageContent } from "../../../domain/message/value-objects/message-content.value-object";
import { MessageId } from "../../../domain/message/value-objects/message-id.value-object";
import { MessageStatusValueObject, MessageStatusType } from "../../../domain/message/value-objects/message-status.value-object";
import { UserRepository } from "../../../domain/user/repositories/user.repository.interface";
import { UserId } from "../../../domain/user/value-objects/user-id.value-object";
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
export class MessageApplicationService {
  private readonly logger = new Logger(MessageApplicationService.name);

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
        MessageStatusValueObject.create(MessageStatusType.SENT),
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
