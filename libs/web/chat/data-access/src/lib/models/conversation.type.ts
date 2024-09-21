export interface Conversation {
  conversationId: string;
  avatarUrl: string;
  name: string;
  chatType: string;
  active: boolean;
  lastMessageContent?: string;
  lastMessageTimestamp: string;
  lastMessageSenderId?: string;
}
