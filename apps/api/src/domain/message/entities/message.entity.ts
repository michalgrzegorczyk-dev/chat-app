// src/domain/messages/entities/message.entity.ts
import { ConversationId } from "../../conversation/value-objects/conversation-id.value-object";
import { User } from "../../user/entities/user.entity";
import { MessageContent } from "../value-objects/message-content.value-object";
import { MessageId } from "../value-objects/message-id.value-object";
import { MessageStatusValueObject } from "../value-objects/message-status.value-object";

export class Message {
  constructor(
    private readonly id: MessageId,
    private readonly sender: User,
    private readonly conversationId: ConversationId,
    private content: MessageContent,
    private status: MessageStatusValueObject,
    private readonly createdAt: Date,
    private readonly localMessageId: string,
  ) {
    // Ensure createdAt is a Date object
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  public getId(): MessageId {
    return this.id;
  }

  getLocalMessageId(): string {
    return this.localMessageId;
  }

  getConversationId(): ConversationId {
    return this.conversationId;
  }

  public getContent(): string {
    return this.content.getValue();
  }

  public getSender(): User {
    return this.sender;
  }

  public getStatus(): MessageStatusValueObject {
    return this.status;
  }

  public setStatus(status: MessageStatusValueObject): void {
    this.status = status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
