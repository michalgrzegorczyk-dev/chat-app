import { Conversation } from './conversation.type';
import { User } from './user.type';
import { Message } from './message.type';

export interface ChatState {
  messageList: Message[];
  selectedConversation: Conversation | null;
  conversationList: Conversation[];
  selectedConversationLoading: boolean;
  messageListLoading: boolean;
  conversationListLoading: boolean;
  memberIdMap: Map<string, User>;
}
