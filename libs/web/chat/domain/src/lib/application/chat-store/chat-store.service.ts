import {Injectable, inject} from '@angular/core';
import {rxState} from '@rx-angular/state';
import {take, Subject} from "rxjs";
import {Router} from "@angular/router";
import {ChatInfrastructureService} from "../../infrastructure/chat-infrastructure.service";
import {ChatState} from "../../entities/chat-state.type";
import {rxEffects} from "@rx-angular/state/effects";
import {Message, ReceivedMessage} from "../../entities/message.type";
import {Conversation} from "../../entities/conversation.type";
import {MessageSend} from "../../entities/message-send.type";
import {ConversationDetails} from "../../entities/conversation-content.type";
import { ROUTES } from '../../../../../../../../apps/web/src/app/app.routes';
import { User } from '../../entities/user.type';
import { sortConversationsByLastMessageTimestamp } from '../sort-conversations';

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

  private readonly router = inject(Router);
  private readonly chatService = inject(ChatInfrastructureService);

  private readonly rxState = rxState<ChatState>(({set, connect}) => {
    set(INITIAL_STATE);
    connect('conversationListLoading', this.setConversationListLoading$, (state, loading) =>  loading);
    connect('conversationList', this.updateConversationList$, (state, messageSend) => {
      return sortConversationsByLastMessageTimestamp(state.conversationList.map(conv => {
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
        conversationList: sortConversationsByLastMessageTimestamp(updatedConversations)
      };
    });
    connect('messageList', this.setMessageList$);
    connect('messageList', this.addMessage$, (state, message) => [...state.messageList, message]);
    connect('conversationList', this.setConversationList$, (state, conversationList) => {

      return conversationList;
    });
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

  // READ
  readonly messageList = this.rxState.signal('messageList');
  readonly messageListLoading = this.rxState.signal('messageListLoading');
  readonly conversationList = this.rxState.signal('conversationList');
  readonly conversationListLoading = this.rxState.signal('conversationListLoading');
  readonly selectedConversation = this.rxState.signal('selectedConversation');
  readonly selectedConversationLoading = this.rxState.signal('selectedConversationLoading');
  readonly memberList = this.rxState.signal('memberIdMap');

  loadConversationList = () => this.loadConversationList$.next();
  setMessageList = (messageList: Message[]) => this.setMessageList$.next(messageList);
  selectConversation = (conversation: Conversation) => this.selectConversation$.next(conversation);
  setMemberMap = (memberMap: Map<string, User>) => this.setMemberIdMap$.next(memberMap);

  private readonly effects = rxEffects(({register}) => {
    register(this.selectConversation$, (selectedConversation: Conversation | null) => {
      if (!selectedConversation) {
        return;
      }

      this.setMessageListLoading$.next(true);
      return this.chatService.getConversationContent(selectedConversation).subscribe((conversationDetails: ConversationDetails) => {
        this.setMessageList(conversationDetails.messageList);
        this.setMemberMap(new Map(conversationDetails.memberList.map(member => [member.id, member])));
        this.setMessageListLoading$.next(false);
      });
    });
    register(this.selectConversation$, (conversation: Conversation | null) => {
      if (!conversation) {
        return;
      }
      this.router.navigate([`/${ROUTES.CHAT}`, conversation.conversationId]);
    });
    register(this.loadConversationList$, () => {
      this.setConversationListLoading$.next(true);
      this.setConversationList$.next([]);
      this.chatService.fetchConversations().pipe(take(1)).subscribe((conversationList: Conversation[]) => {
        console.log('received conversation list', conversationList);
        this.setConversationList$.next(conversationList);
        if (conversationList[0]) {
          this.selectConversation(conversationList[0]);
        }
        this.setConversationListLoading$.next(false);
      });
    });
  });

  sendMessage = (msg: MessageSend) => {
    this.chatService.sendMessage(msg);
    this.updateConversationList$.next(msg);
  };
}
