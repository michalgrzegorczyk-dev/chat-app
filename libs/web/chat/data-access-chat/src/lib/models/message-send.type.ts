import { MessageStatus } from '@chat-app/dtos';

export interface MessageSend {
  localMessageId: string;
  conversationId: string;
  userId: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
}
