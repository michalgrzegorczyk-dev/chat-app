import { Conversation } from "../entities/conversation.entity";
import { ConversationId } from "../value-objects/conversation-id";

export interface ConversationRepository {
  findById(id: ConversationId): Promise<Conversation | null>;
  findByUserId(userId: string): Promise<Conversation[]>;
  save(conversation: Conversation): Promise<void>;
  update(conversation: Conversation): Promise<void>;
}
