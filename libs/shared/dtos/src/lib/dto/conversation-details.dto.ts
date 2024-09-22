export interface ConversationDetailsDto {
  conversationId: string;
  messageList: MessageDto[];
  memberList: Map<string, string>;
}

export interface MessageDto {
  message_id: string;
  content: string;
  sender_id: string;
  created_at: string;
}
