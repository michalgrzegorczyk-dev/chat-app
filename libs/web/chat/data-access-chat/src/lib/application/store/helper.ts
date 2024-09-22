import { ChatState } from '../../models/chat-state.type';
import { Conversation } from '../../models/conversation.type';
import { ReceivedMessage } from '../../models/message.type';

export function sendMessageSuccess() {
  return (state: ChatState, message: ReceivedMessage) => {
    return state.selectedConversation?.conversationId === message.conversationId ?
      [...state.messageList, message] : state.messageList;
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
      ...conv
    }));

    return {
      ...state,
      conversationList: updatedConversations,
      selectedConversation: conversation
    };
  };
}
