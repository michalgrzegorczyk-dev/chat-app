import { Conversation } from '../entities/conversation.type';

export function sortConversationsByLastMessageTimestamp(conversations: Conversation[]): Conversation[] {
  return conversations.sort((a, b) => {
    if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
      return b.lastMessageTimestamp.localeCompare(a.lastMessageTimestamp);
    }
    return 0;
  });
}
