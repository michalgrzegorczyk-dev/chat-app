export interface ConversationListElementDto {
  conversationId: string;
  name: string;
  avatarUrl?: string;
  lastMessageContent: string;
  lastMessageTimestamp: string;
  lastMessageSenderId: string;
}
