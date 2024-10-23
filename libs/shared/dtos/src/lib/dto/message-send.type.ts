import { MessageStatus } from './shared-types';

export interface MessageSendDto {
  localMessageId: string; // local_message_id
  conversationId: string; // conversation_id
  userId: string; // sender_id
  content: string; //content
  timestamp: string; //created_at
  status: MessageStatus; // status ''
}
