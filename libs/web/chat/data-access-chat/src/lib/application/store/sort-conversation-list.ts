import { Conversation } from '../../models/conversation.type';

export function sortConversationListByLastMessageTimestamp(
  conversations: Conversation[]
): Conversation[] {
  return conversations.sort((a, b) => {
    if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
      return b.lastMessageTimestamp.localeCompare(a.lastMessageTimestamp);
    }
    return 0;
  });
}