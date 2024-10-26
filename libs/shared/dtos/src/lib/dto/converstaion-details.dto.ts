import { MessageStatus } from "./shared-types";

export interface ConversationDetailsDto {
  conversationId: string;
  messageList: MessageDto[];
  memberList: any;
}

export interface MemberDto {
  id: string;
  name: string;
  profile_photo_url: string;
}

export interface MessageDto {
  message_id: string;
  content: string;
  sender_id: string;
  created_at: string;
  status: MessageStatus;
}

export interface ReceiveMessageDto extends MessageDto {
  conversation_id: string;
}
