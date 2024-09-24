import { ChatState } from '../../models/chat-state.type';
import { Conversation } from '../../models/conversation.type';
import { ReceivedMessage, Message } from '../../models/message.type';

export function sendMessageSuccess(state: ChatState, message: ReceivedMessage): Message[] {
    console.log(message);
    return state.selectedConversation?.conversationId === message.conversationId ?
      [...state.messageList.map(msg => {

        console.log(msg.localMessageId);
        console.log(message.localMessageId);

        if(msg.localMessageId === message.localMessageId) {
          const newMsg: Message = {
            ...msg,
            status: 'sent'
          };
          return newMsg;
        }
        return msg;
      })] : state.messageList;


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
