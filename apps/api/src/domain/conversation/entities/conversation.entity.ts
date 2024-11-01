import { Message } from "../../messages/entities/message.entity";
import { User } from "../../user/entities/user.entity";
import { ConversationId } from "../value-objects/conversation-id";
import { ConversationType } from "../value-objects/conversation-type";

export class Conversation {
  private readonly id: ConversationId;
  private readonly name: string;
  private avatarUrl?: string;
  private readonly type: ConversationType;
  private readonly members: User[];
  private messages: Message[];
  private lastMessage?: Message;

  constructor(id: ConversationId, name: string, type: ConversationType, members: User[], avatarUrl?: string) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.members = members;
    this.avatarUrl = avatarUrl;
    this.messages = [];
  }

  public addMessage(message: Message): void {
    this.messages.push(message);
    this.lastMessage = message;
  }

  public getId(): ConversationId {
    return this.id;
  }

  public getMembers(): User[] {
    return [...this.members];
  }

  public getLastMessage(): Message | undefined {
    return this.lastMessage;
  }

  public getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  public getLastMessageTimestamp(): Date | undefined {
    return this.lastMessage?.getCreatedAt();
  }

  public getLastMessageSenderId(): string | undefined {
    return this.lastMessage?.getSender().getId();
  }

  public getName(): string {
    if (this.type === ConversationType.DIRECT && this.members.length === 2) {
      const otherUser = this.members.find((member) => member.getId() !== this.members[0].getId());
      return otherUser?.getName() || this.name;
    }
    return this.name;
  }
}
