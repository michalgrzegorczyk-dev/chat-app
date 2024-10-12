export interface Conversation {
  conversationId: string;
  avatarUrl: string;
  name: string;
  lastMessageContent: string;
  lastMessageTimestamp: string;
  lastMessageSenderId?: string;
}
