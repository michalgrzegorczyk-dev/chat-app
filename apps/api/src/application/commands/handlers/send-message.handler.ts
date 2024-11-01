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
import { SendMessageCommand } from "../send-message.command";
import { MessageSentEvent } from "../../events/message-sent.event";

@Injectable()
@CommandHandler(SendMessageCommand)
export class SendMessageHandler implements ICommandHandler<SendMessageCommand> {
  readonly #logger = new Logger(SendMessageHandler.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: SendMessageCommand) {
    this.#logger.debug(`Processing SendMessageCommand`);
    const sender = await this.userRepository.findById(new UserId(command.senderId));

    const message = new Message(
      MessageId.generate(),
      sender,
      new ConversationId(command.conversationId),
      new MessageContent(command.content),
      MessageStatus.create("SENT"),
      command.timestamp instanceof Date ? command.timestamp : new Date(command.timestamp),
      command.localMessageId,
    );

    const savedMessage = await this.messageRepository.save(message);

    await this.conversationRepository.updateLastMessage(new ConversationId(command.conversationId), {
      messageId: savedMessage.getId().toString(),
      content: savedMessage.getContent(),
      senderId: sender.getId(),
      timestamp: savedMessage.getCreatedAt(),
    });

    const eventData = {
      id: savedMessage.getId().toString(),
      content: savedMessage.getContent(),
      senderId: sender.getId(),
      conversationId: command.conversationId,
      createdAt: savedMessage.getCreatedAt(),
      status: savedMessage.getStatus().getValue(),
      localMessageId: command.localMessageId,
    };

    await this.eventBus.publish(
      new MessageSentEvent(eventData, {
        id: sender.getId(),
        name: sender.getName(),
        profilePhotoUrl: sender.getProfilePhotoUrl(),
      }),
    );

    this.#logger.debug("Message sent and event published successfully");
  }
}
