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
  private readonly logger = new Logger(MessageSentHandler.name);

  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
    private readonly chatGateway: ChatGateway,
  ) {}

  async handle(event: MessageSentEvent): Promise<void> {
    try {
      this.logger.debug(`Handling MessageSentEvent: ${JSON.stringify(event)}`);

      // Update last message in conversation
      await this.conversationRepository.updateLastMessage(new ConversationId(event.message.conversationId), {
        messageId: event.message.id,
        content: event.message.content,
        senderId: event.message.senderId,
        timestamp: event.message.createdAt,
      });

      // Get participants and update their chat state
      const participants = await this.conversationRepository.getParticipants(event.message.conversationId);

      for (const userId of participants) {
        // Get updated conversation list for sidebar
        const conversations = await this.conversationRepository.getUserConversations(userId);

        // Get full conversation details
        const conversationDetails = await this.conversationRepository.findById(new ConversationId(event.message.conversationId));

        // Emit updates to the participant
        this.chatGateway.emitToUser(userId, "loadConversationListSuccess", conversations);
        this.chatGateway.emitToUser(userId, "sendMessageSuccess", {
          message: {
            message_id: event.message.id,
            content: event.message.content,
            created_at: event.message.createdAt,
            sender_id: event.message.senderId,
            status: event.message.status,
            local_message_id: event.message.localMessageId,
          },
          sender: event.sender,
          messageList: conversationDetails.messageList,
          conversationId: event.message.conversationId,
        });
      }

      this.logger.debug("Message sent event handled successfully");
    } catch (error) {
      this.logger.error(`Failed to handle message sent event: ${error.message}`);
      throw error;
    }
  }
}
