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
    message_id: string;
    content: string;
    sender_id: string;
    created_at: string;
}

export interface ReceiveMessageDto extends MessageDto {
    conversation_id: string;
}

