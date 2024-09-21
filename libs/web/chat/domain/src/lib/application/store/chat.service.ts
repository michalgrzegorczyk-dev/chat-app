import {Injectable, inject} from '@angular/core';
import {rxState} from '@rx-angular/state';
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {ChatInfrastructureService} from "../../infrastructure/chat-infrastructure.service";
import {ChatState} from "../../models/chat-state.type";
import {Message, ReceivedMessage} from "../../models/message.type";
import {Conversation} from "../../models/conversation.type";
import {MessageSend} from "../../models/message-send.type";
import { User } from '../../models/user.type';
import { sortConversationListByLastMessageTimestamp } from './sort-conversations';
import { setupChatEffects } from './effects';

const INITIAL_STATE: ChatState = {
  messageList: [],
  messageListLoading: false,
  conversationList: [],
  conversationListLoading: false,
  selectedConversation: null,
  selectedConversationLoading: false,
  memberIdMap: new Map()
};

@Injectable({
  providedIn: 'root'
})
export class ChatStoreService {
  // EVENTS
  readonly setMessageList$ = new Subject<Message[]>();
  readonly setMessageListLoading$ = new Subject<boolean>();
  readonly setConversationList$ = new Subject<Conversation[]>();
  readonly selectConversation$ = new Subject<Conversation | null>();
  readonly setConversationListLoading$ = new Subject<boolean>();
  readonly addMessage$ = new Subject<Message>();
  readonly setMemberIdMap$ = new Subject<Map<string, User>>();
  readonly loadConversationList$ = new Subject<void>();
  readonly updateConversationList$ = new Subject<MessageSend>();

  readonly router = inject(Router);
  readonly chatService = inject(ChatInfrastructureService);

  private readonly rxState = rxState<ChatState>(({set, connect}) => {
    set(INITIAL_STATE);
    connect('conversationListLoading', this.setConversationListLoading$, (state, loading) =>  loading);
    connect('conversationList', this.updateConversationList$, (state, messageSend) => {
      return sortConversationListByLastMessageTimestamp(state.conversationList.map(conv => {
        if (conv.conversationId === messageSend.conversationId) {
          conv.lastMessageContent = messageSend.content;
          conv.lastMessageTimestamp = messageSend.timestamp;
          conv.lastMessageSenderId = messageSend.userId;
        }
        return conv;
      }));
    });
    connect(this.chatService.receiveMessage$, (state, message: ReceivedMessage) => {
      const updatedConversations = state.conversationList.map(conv => {
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
        messageList: state.selectedConversation?.conversationId === message.conversationId
          ? [...state.messageList, message]
          : state.messageList,
        conversationList: sortConversationListByLastMessageTimestamp(updatedConversations)
      };
    });
    connect('messageList', this.setMessageList$);
    connect('messageList', this.addMessage$, (state, message) => [...state.messageList, message]);
    connect('conversationList', this.setConversationList$, (state, conversationList) => conversationList);
    connect('messageListLoading', this.setMessageListLoading$);
    connect('memberIdMap', this.setMemberIdMap$);
    connect(this.selectConversation$, (state, conversation) => {
      if (!conversation) {
        return {
          ...state,
        };
      }

      const updatedConversations = state.conversationList.map(conv => ({
        ...conv,
        active: conv.conversationId === conversation.conversationId
      }));

      const activeConversation = updatedConversations.find(conv => conv.active) || null;

      return {
        ...state,
        conversationList: updatedConversations,
        selectedConversation: activeConversation,
      };
    });
  });

  private readonly effects = setupChatEffects(this);

  // READ
  readonly messageList = this.rxState.signal('messageList');
  readonly messageListLoading = this.rxState.signal('messageListLoading');
  readonly conversationList = this.rxState.signal('conversationList');
  readonly conversationListLoading = this.rxState.signal('conversationListLoading');
  readonly selectedConversation = this.rxState.signal('selectedConversation');
  readonly selectedConversationLoading = this.rxState.signal('selectedConversationLoading');
  readonly memberIdMap = this.rxState.signal('memberIdMap');

  loadConversationList = (): void => this.loadConversationList$.next();
  setMessageList = (messageList: Message[]): void => this.setMessageList$.next(messageList);
  selectConversation = (conversation: Conversation): void => this.selectConversation$.next(conversation);
  setMemberMap = (memberMap: Map<string, User>): void => this.setMemberIdMap$.next(memberMap);

  sendMessage(msg: MessageSend): void {
    this.chatService.sendMessage(msg);
    this.updateConversationList$.next(msg);
  };
}
