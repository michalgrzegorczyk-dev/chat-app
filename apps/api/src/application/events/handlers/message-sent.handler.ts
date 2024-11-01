import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

import { CONVERSATION_REPOSITORY, ConversationRepository } from "../../../domain/conversation/repositories/conversation.repository";
import { ConversationId } from "../../../domain/conversation/value-objects/conversation-id";
import { ChatGateway } from "../../../interfaces/websocket/chat.gateway";
import { MessageSentEvent } from "../message-sent.event";

@Injectable()
@EventsHandler(MessageSentEvent)
export class MessageSentHandler implements IEventHandler<MessageSentEvent> {
  private readonly logger = new Logger(MessageSentHandler.name);

  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    private readonly chatGateway: ChatGateway,
  ) {}

  async handle(event: MessageSentEvent): Promise<void> {
    try {
      this.logger.debug(`Handling MessageSentEvent: ${JSON.stringify(event)}`);

      await this.conversationRepository.updateLastMessage(new ConversationId(event.message.conversationId), {
        messageId: event.message.id,
        content: event.message.content,
        senderId: event.message.senderId,
        timestamp: event.message.createdAt,
      });

      const participants = await this.conversationRepository.getParticipants(event.message.conversationId);

      for (const userId of participants) {
        const conversations = await this.conversationRepository.getUserConversations(userId);

        this.chatGateway.emitToUser(userId, "loadConversationListSuccess", conversations);
        this.chatGateway.emitToUser(userId, "sendMessageSuccess", {
          ...event.message,
          sender: event.sender,
        });
      }

      this.logger.debug("Message sent event handled successfully");
    } catch (error) {
      this.logger.error(`Failed to handle message sent event: ${error.message}`);
      throw error;
    }
  }
}
