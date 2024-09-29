import { MessageStatus } from '@chat-app/dtos';

export interface MessageSend {
  localMessageId: string; // local_message_id
  conversationId: string; // conversation_id
  userId: string; // sender_id
  content: string; //content
  timestamp: string; //created_at
  status: MessageStatus; // status ''
}
