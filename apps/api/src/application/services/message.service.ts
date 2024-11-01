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
      // Validate sender exists
      const sender = await this.userRepository.findById(new UserId(dto.senderId));
      if (!sender) {
        throw new Error("Sender not found");
      }

      // Create message entity with proper value objects
      const message = new Message(
        dto.messageId ? new MessageId(dto.messageId) : MessageId.generate(),
        sender,
        new ConversationId(dto.conversationId),
        new MessageContent(dto.content),
        MessageStatus.create(MessageStatusType.SENT),
        dto.timestamp || new Date(),
      );

      // Save message through repository
      const savedMessage = await this.messageRepository.save(message);

      // Update conversation's last message
      await this.conversationRepository.updateLastMessage(new ConversationId(dto.conversationId), {
        messageId: savedMessage.getId().toString(),
        content: savedMessage.getContent(),
        senderId: sender.getId(),
        timestamp: savedMessage.getCreatedAt(),
      });

      return savedMessage;
    } catch (error) {
      this.logger.error(`Failed to send message: ${error.message}`);
      throw error;
    }
  }

  async getConversationMessages(dto: GetMessagesDto): Promise<Message[]> {
    try {
      const conversationId = new ConversationId(dto.conversationId);

      // Verify conversation exists
      const conversation = await this.conversationRepository.findById(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }

      // Get messages from repository
      const messages = await this.messageRepository.findByConversationId(conversationId);

      return messages;
    } catch (error) {
      this.logger.error(`Failed to get conversation messages: ${error.message}`);
      throw error;
    }
  }
}
