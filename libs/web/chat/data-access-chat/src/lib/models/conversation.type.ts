export interface Conversation {
  conversationId: string;
  avatarUrl: string;
  name: string;
  chatType: string;
  lastMessageContent: string;
  lastMessageTimestamp: string;
  lastMessageSenderId?: string;
}
