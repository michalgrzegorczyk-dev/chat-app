import { Message } from './message.type';

export interface ReceivedMessage extends Message {
  conversationId: string;
}
