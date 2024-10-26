import { Member } from './member.type';
import { Message } from './message.type';

export type ConversationDetails = {
  conversationId: string;
  messageList: Message[];
  memberList: Member[];
}
