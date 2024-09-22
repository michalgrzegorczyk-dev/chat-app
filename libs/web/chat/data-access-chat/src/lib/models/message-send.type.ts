import { MessageStatus } from '@chat-app/dtos';

export interface MessageSend {
  conversationId: string;
  userId: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
}
