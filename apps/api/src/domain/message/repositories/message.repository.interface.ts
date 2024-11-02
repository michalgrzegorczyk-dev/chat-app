import { ConversationId } from "../../conversation/value-objects/conversation-id.value-object";
import { Message } from "../entities/message.entity";
import { MessageId } from "../value-objects/message-id.value-object";
import { MessageStatusValueObject } from "../value-objects/message-status.value-object";

export const MESSAGE_REPOSITORY = "MESSAGE_REPOSITORY";

export interface MessageRepository {
  save(message: Message): Promise<Message>;
  findByConversationId(conversationId: ConversationId): Promise<Message[]>;
  updateStatus(messageId: MessageId, status: MessageStatusValueObject): Promise<void>;
}
