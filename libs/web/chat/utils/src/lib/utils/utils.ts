// import { Conversation } from '@chat-app/domain';

export function sortConversationsByLastMessageTimestamp(conversations: any[]): any[] {
  return conversations.sort((a, b) => {
    if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
      return b.lastMessageTimestamp.localeCompare(a.lastMessageTimestamp);
    }
    return 0;
  });
}
