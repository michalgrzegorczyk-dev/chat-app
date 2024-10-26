import { MessageStatus } from '@chat-app/dtos';

export type Message = {
  createdAt: string;
  localMessageId?: string;
  messageId: string;
  senderId: string;
  content: string;
  status?: MessageStatus;
}
