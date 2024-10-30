import { Message } from "../../message/entities/message.entity";
import { User } from "../../user/entities/user.entity";
import { ConversationType } from "../value-objects/conversation-type";
import { ConversationId } from "../value-objects/conversation-id";

export class Conversation {
  private readonly id: ConversationId;
  private name: string;
  private avatarUrl?: string;
  private type: ConversationType;
  private members: User[];
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

  public getName(): string {
    if (this.type === ConversationType.DIRECT && this.members.length === 2) {
      const otherUser = this.members.find((member) => member.getId() !== this.members[0].getId());
      return otherUser?.getName() || this.name;
    }
    return this.name;
  }
}
