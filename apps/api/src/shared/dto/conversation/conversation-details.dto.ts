export interface ConversationDetailsDto {
  conversationId: string;
  messageList: MessageDto[];
  memberList: MemberDto[];
}

export interface MessageDto {
  message_id: string;
  content: string;
  created_at: string;
  sender_id: string;
  status: string;
}

export interface MemberDto {
  id: string;
  name: string;
  profile_photo_url: string | null;
}
