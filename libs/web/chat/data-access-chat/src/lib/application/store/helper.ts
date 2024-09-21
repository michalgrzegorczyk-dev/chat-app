import { ChatState } from '../../models/chat-state.type';
import { MessageSend } from '../../models/message-send.type';
import { Conversation } from '../../models/conversation.type';
import { sortConversationListByLastMessageTimestamp } from './sort-conversation-list';
import { ReceivedMessage } from '@chat-app/domain';

export function updateConversationList() {
  return (state: ChatState, messageSend: MessageSend) => {
    return sortConversationListByLastMessageTimestamp(
      state.conversationList.map((conv: Conversation) => {
        if (conv.conversationId === messageSend.conversationId) {
          conv.lastMessageContent = messageSend.content;
          conv.lastMessageTimestamp = messageSend.timestamp;
          conv.lastMessageSenderId = messageSend.userId;
        }
        return conv;
      })
    );
  };
}

export function receiveMessage() {
  return (state: ChatState, message: ReceivedMessage) => {
    const updatedConversations = state.conversationList.map((conv: Conversation) => {
      if (conv.conversationId === message.conversationId) {
        return {
          ...conv,
          lastMessageContent: message.content,
          lastMessageTimestamp: message.createdAt,
          lastMessageSenderId: message.senderId
        };
      }
      return conv;
    });

    return {
      ...state,
      messageList:
        state.selectedConversation?.conversationId ===
        message.conversationId
          ? [...state.messageList, message]
          : state.messageList,
      conversationList:
        sortConversationListByLastMessageTimestamp(updatedConversations)
    };
  };
}

export function selectConversation(): any {
  return (state: ChatState, conversation: Conversation): any => {
    if (!conversation) {
      return {
        ...state
      };
    }

    const updatedConversations = state.conversationList.map((conv: Conversation) => ({
      ...conv,
      active: conv.conversationId === conversation.conversationId
    }));

    const activeConversation =
      updatedConversations.find((conv: Conversation) => conv.active) || null;

    return {
      ...state,
      conversationList: updatedConversations,
      selectedConversation: activeConversation
    };
  };
}
