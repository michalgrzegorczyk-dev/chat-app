export interface Message {
  createdAt: string;
  messageId: string;
  senderId: string;
  content: string;
}

export interface ReceivedMessage extends Message {
  conversationId: string;
}
