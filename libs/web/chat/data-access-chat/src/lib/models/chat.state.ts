import { User } from "@chat-app/web/shared/util/auth";

import { Conversation } from "./conversation.type";
import { Message } from "./message.type";

export type ChatState = {
  messageList: Message[];
  messageListLoading: boolean;
  conversationList: Conversation[];
  conversationListLoading: boolean;
  selectedConversation: Conversation | null;
  selectedConversationLoading: boolean;
  memberIdMap: Map<string, User>;
};
