export interface ConversationListElementDto { //todo conversationListElementDto
  conversationId: string;
  avatarUrl: string;
  name: string;
  chatType: string; // todo conversation type

  //todo make it nested object
  lastMessageTimestamp: string;
  lastMessageContent: string;
  lastMessageSenderId: string;
}
