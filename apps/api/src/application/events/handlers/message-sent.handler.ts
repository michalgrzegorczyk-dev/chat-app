import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

import { CONVERSATION_REPOSITORY, ConversationRepository } from "../../../domain/conversation/repositories/conversation.repository";
import { ConversationId } from "../../../domain/conversation/value-objects/conversation-id";
import { MESSAGE_REPOSITORY, MessageRepository } from "../../../domain/messages/repositories/message.repository";
import { ChatGateway } from "../../../interfaces/websocket/chat.gateway";
import { MessageSentEvent } from "../message-sent.event";

@Injectable()
@EventsHandler(MessageSentEvent)
export class MessageSentHandler implements IEventHandler<MessageSentEvent> {
  readonly #logger = new Logger(MessageSentHandler.name);

  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    private readonly chatGateway: ChatGateway,
  ) {}

  async handle(event: MessageSentEvent): Promise<void> {
    this.#logger.debug(`Handling MessageSentEvent (publish)`);

    await this.conversationRepository.updateLastMessage(new ConversationId(event.message.conversationId), {
      messageId: event.message.id,
      content: event.message.content,
      senderId: event.message.senderId,
      timestamp: event.message.createdAt,
    });

    const messagePayload = {
      message: {
        message_id: event.message.id,
        content: event.message.content,
        created_at: event.message.createdAt,
        sender_id: event.message.senderId,
        status: event.message.status,
        local_message_id: event.message.localMessageId,
      },
      sender: event.sender,
      conversationId: event.message.conversationId,
    };

    this.chatGateway.emitToConversation(event.message.conversationId, "sendMessageSuccess", messagePayload);
    this.#logger.debug("Message sent event handled successfully");
  }
}
