export type SendMessageRequestDto = {
  content: string;
  userId: string;
  conversationId: string;
  localMessageId: string;
  timestamp?: Date;
};

// export interface MessageSend {
//   conversationId: string;
//   userId: string;
//   content: string;
//   timestamp: string;
//
//   missing
//   localMessageId: string;
//   status: MessageStatus;
// }
