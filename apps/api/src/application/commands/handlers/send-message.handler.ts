import { Injectable, Logger, Inject } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";

import { ConversationRepository, CONVERSATION_REPOSITORY } from "../../../domain/conversation/repositories/conversation.repository";
import { ConversationId } from "../../../domain/conversation/value-objects/conversation-id";
import { Message } from "../../../domain/messages/entities/message.entity";
import { MessageRepository, MESSAGE_REPOSITORY } from "../../../domain/messages/repositories/message.repository";
import { MessageContent } from "../../../domain/messages/value-objects/message-content";
import { MessageId } from "../../../domain/messages/value-objects/message-id";
import { MessageStatus } from "../../../domain/messages/value-objects/message-status";
import { UserRepository, USER_REPOSITORY } from "../../../domain/user/repositiories/user.repository";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { ChatGateway } from "../../../interfaces/websocket/chat.gateway";
import { SendMessageCommand } from "../send-message.command";
import { MessageSentEvent } from "../../events/message-sent.event";
@Injectable()
@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  private readonly logger = new Logger(SendMessageHandler.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly chatGateway: ChatGateway,
  ) {}

  async execute(command: SendMessageCommand): Promise<void> {
    try {
      this.logger.debug(`Processing SendMessageCommand: ${JSON.stringify(command)}`);

      const sender = await this.userRepository.findById(new UserId(command.senderId));
      if (!sender) {
        throw new Error("Sender not found");
      }

      const message = new Message(
        MessageId.generate(),
        sender,
        new ConversationId(command.conversationId),
        new MessageContent(command.content),
        MessageStatus.create("SENT"),
        command.timestamp,
      );

      const savedMessage = await this.messageRepository.save(message);

      // Publish MessageSentEvent
      await this.eventBus.publish(
        new MessageSentEvent(
          {
            id: savedMessage.getId().toString(),
            content: savedMessage.getContent(),
            senderId: sender.getId(),
            conversationId: command.conversationId,
            createdAt: savedMessage.getCreatedAt(),
            status: savedMessage.getStatus().getValue(),
          },
          {
            id: sender.getId(),
            name: sender.getName(),
            profilePhotoUrl: sender.getProfilePhotoUrl(),
          },
        ),
      );

      this.logger.debug("Message sent and event published successfully");
    } catch (error) {
      this.logger.error(`Failed to process send message command: ${error.message}`);
      throw error;
    }
  }
}
