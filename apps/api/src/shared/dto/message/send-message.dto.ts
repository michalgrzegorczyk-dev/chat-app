export interface SendMessageRequestDto {
  content: string;
  userId: string;
  conversationId: string;
  timestamp?: Date;
  localMessageId: string;
}
