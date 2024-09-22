import { MessageStatus } from '@chat-app/dtos';

export interface Message {
  createdAt: string;
  messageId: string;
  senderId: string;
  content: string;
  status?: MessageStatus;
}

export interface ReceivedMessage extends Message {
  conversationId: string;
}
