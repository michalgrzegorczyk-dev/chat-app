import { Conversation } from "../entities/conversation.entity";
import { ConversationId } from "../value-objects/conversation-id.value-object";
import { ConversationDetailsDto } from "../../../shared/dto/conversation/conversation-details.dto";
import { ConversationListElementDto } from "../../../shared/dto/conversation/conversation-list.dto";

export const CONVERSATION_REPOSITORY = "CONVERSATION_REPOSITORY";

export interface ConversationRepository {
  findById(id: ConversationId): Promise<ConversationDetailsDto>;
  getUserConversations(userId: string): Promise<ConversationListElementDto[]>; // Changed method name to match implementation
  save(conversation: Conversation): Promise<void>;
  update(conversation: Conversation): Promise<void>;
  updateLastMessage(
    conversationId: ConversationId,
    lastMessage: {
      messageId: string;
      content: string;
      senderId: string;
      timestamp: Date;
    },
  ): Promise<void>;
  getParticipants(conversationId: string): Promise<string[]>;
}
