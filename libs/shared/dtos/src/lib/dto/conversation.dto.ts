export interface ConversationDto {
  conversationId: string;
  avatarUrl: string;
  name: string;
  chatType: string;
  lastMessageTimestamp: string; //todo
  lastMessageContent: string;
  lastMessageSenderId?: string;

}

//todo domain -> data-access-chat
//todo mappery -> w data-access-chat
//zod // mapper validator
// details spoko
