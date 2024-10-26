import { Message, Conversation } from '@chat-app/domain';
import { User } from '@chat-app/web/shared/util/auth';

export type ChatState = {
  messageList: Message[];
  messageListLoading: boolean;
  conversationList: Conversation[];
  conversationListLoading: boolean;
  selectedConversation: Conversation | null;
  selectedConversationLoading: boolean;
  memberIdMap: Map<string, User>;
}
