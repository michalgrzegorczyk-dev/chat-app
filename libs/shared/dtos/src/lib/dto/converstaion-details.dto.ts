import { MessageStatus } from "./shared-types";

export interface ConversationDetailsDto {
  conversationId: string;
  messageList: MessageDto[];
  memberList: MemberDto[];
}

export interface MemberDto {
  id: string;
  name: string;
  profile_photo_url: string;
}

export interface MessageDto {
  // message_id: string;
  // content: string;
  // sender_id: string;
  // created_at: string;
  // status: MessageStatus;
  message_id: string;
  local_message_id: string;
  content: string;
  created_at: string;
  sender_id: string;
  status: string;
}

export interface ReceiveMessageDto extends MessageDto {
  conversation_id: string;
}
