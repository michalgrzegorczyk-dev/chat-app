import { ConversationId } from "../../conversation/value-objects/conversation-id";
import { Message } from "../entities/message.entity";
import { MessageId } from "../value-objects/message-id";
import { MessageStatus } from "../value-objects/message-status";

export const MESSAGE_REPOSITORY = "MESSAGE_REPOSITORY";

export interface MessageRepository {
  save(message: Message): Promise<Message>;
  findByConversationId(conversationId: ConversationId): Promise<Message[]>;
  updateStatus(messageId: MessageId, status: MessageStatus): Promise<void>;
}
