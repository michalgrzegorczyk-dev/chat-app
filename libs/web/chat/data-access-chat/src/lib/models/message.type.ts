import { MessageStatus } from '@chat-app/dtos';

export interface Message {
  createdAt: string;
  localMessageId?: string;
  messageId: string;
  senderId: string;
  content: string;
  status?: MessageStatus;
}
