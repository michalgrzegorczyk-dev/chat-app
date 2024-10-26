import { Message } from "./message.type";

export type ReceivedMessage = Message & {
  conversationId: string;
};
