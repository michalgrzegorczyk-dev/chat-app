import { Member } from './member.type';
import { Message } from './message.type';

export interface ConversationDetails {
  conversationId: string;
  messageList: Message[];
  memberList: Member[];
}
