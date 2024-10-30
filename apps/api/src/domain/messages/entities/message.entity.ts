import { ConversationId } from "../../conversation/value-objects/conversation-id";
import { User } from "../../user/entities/user.entity";
import { MessageContent } from "../value-objects/message-content";
import { MessageId } from "../value-objects/message-id";
import { MessageStatus } from "../value-objects/message-status";

export class Message {
  constructor(
    private readonly id: MessageId,
    private readonly sender: User,
    private readonly conversationId: ConversationId,
    private content: MessageContent,
    private status: MessageStatus,
    private readonly createdAt: Date,
  ) {}

  public getContent(): string {
    return this.content.getValue();
  }

  public getSender(): User {
    return this.sender;
  }

  public getStatus(): MessageStatus {
    return this.status;
  }

  public setStatus(status: MessageStatus): void {
    this.status = status;
  }
}
