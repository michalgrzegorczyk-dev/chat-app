import { Injectable, inject } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { Subject, switchMap, of } from 'rxjs';
import { Router } from '@angular/router';
import { ChatInfra } from '../../infra/chat.infra';
import { ChatState } from '../../models/chat-state.type';
import { Message, ReceivedMessage } from '../../models/message.type';
import { Conversation } from '../../models/conversation.type';
import { MessageSend } from '../../models/message-send.type';
import { User } from '../../models/user.type';
import { rxEffects } from '@rx-angular/state/effects';
import { ConversationDetails } from '../../models/conversation-details.type';
import { routing } from '@chat-app/util-routing';
import { take } from 'rxjs/operators';
import { DATA_SYNC_STRATEGY_TOKEN } from '../data-syncer/strategy/data-sync-strategy.token';
import { MessageStatus } from '@chat-app/dtos';
import { AuthService } from '@chat-app/web/shared/util/auth';

const INITIAL_STATE: ChatState = {
  messageList: [],
  messageListLoading: false,
  conversationList: [],
  conversationListLoading: false,
  selectedConversation: null,
  selectedConversationLoading: false,
  memberIdMap: new Map()
};

@Injectable()
export class ChatFeatureStore {
  // EVENTS
  readonly sendMessageEvent$ = new Subject<MessageSend>();
  readonly setMessageList$ = new Subject<Message[]>();
  readonly setMessageListLoading$ = new Subject<boolean>();
  readonly setConversationList$ = new Subject<Conversation[]>();
  readonly selectConversation$ = new Subject<Conversation | null>();
  readonly setConversationListLoading$ = new Subject<boolean>();
  readonly setMemberIdMap$ = new Subject<Map<string, User>>();
  readonly loadConversationList$ = new Subject<void>();
  readonly queue$ = new Subject<MessageSend[]>();
  readonly messageReceived$ = new Subject<ReceivedMessage>();
  private readonly router = inject(Router);
  private readonly chatInfra = inject(ChatInfra);
  private readonly auth = inject(AuthService);
  private readonly rxState = rxState<ChatState>(({ set, connect }) => {
    set(INITIAL_STATE);

    connect('messageList', this.messageReceived$, (state: ChatState, receivedMessage: ReceivedMessage) => {
      if (state.selectedConversation?.conversationId !== receivedMessage.conversationId) {
        return state.messageList;
      }

      // TODO: maybe not the best data structure for frequent updates
      return state.messageList.map((msg: Message) => {
        if (msg.localMessageId === receivedMessage.localMessageId) {
          return {
            ...msg,
            status: 'sent' as MessageStatus,
            messageId: receivedMessage.messageId
          };
        }
        return msg;
      });
    });

    connect('conversationListLoading', this.setConversationListLoading$);
    connect('messageList', this.chatInfra.messageReceived$, (state, message) => {
      if (state.selectedConversation?.conversationId === message.conversationId &&
        message.senderId !== this.auth.user().id) {
        return [...state.messageList, message];
      }
      return state.messageList;
    });
    connect('messageList', this.setMessageList$, (state, messageList) => {
      return messageList;
    });
    connect('messageList', this.queue$, (state, queue: MessageSend[]) => {
      if (queue && queue.length === 0) {
        return state.messageList;
      }

      const toAdd = queue.filter((msg) => !state.messageList.find((m) => m.localMessageId === msg.localMessageId));

      for (const msg of toAdd) {
        state.messageList.push({
          localMessageId: msg.localMessageId,
          messageId: '',
          senderId: msg.userId,
          content: msg.content,
          createdAt: new Date().toISOString(),
          status: 'sending'
        });
      }

      return state.messageList;
    });

    connect('messageList', this.sendMessageEvent$, (state, message) => {
      // optimistic update
      return [...state.messageList, {
        localMessageId: message.localMessageId,
        messageId: '', //todo
        senderId: message.userId,
        content: message.content,
        createdAt: new Date().toISOString(),
        status: 'sending'
      }];
    });
    connect('conversationList', this.setConversationList$);
    connect('conversationList', this.chatInfra.loadConversationListSuccess$);
    connect('messageListLoading', this.setMessageListLoading$);
    connect('memberIdMap', this.setMemberIdMap$);
    connect(this.selectConversation$, (state, conversation) => {
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
    });
  });
  // READ
  readonly messageList = this.rxState.signal('messageList');
  readonly messageListLoading = this.rxState.signal('messageListLoading');
  readonly conversationList = this.rxState.signal('conversationList');
  readonly conversationListLoading = this.rxState.signal('conversationListLoading');
  readonly selectedConversation = this.rxState.signal('selectedConversation');
  readonly memberIdMap = this.rxState.signal('memberIdMap');


  effects = rxEffects(({ register }) => {
    register(this.chatInfra.messageReceived$, (message) => {
      return this.messageReceived$.next(message);
    });

    register(this.sendMessageEvent$, (messageSend) => {
      this.chatInfra.sendMessageWebSocket(messageSend);
    });

    register(this.selectConversation$, (selectedConversation) => {
      if (!selectedConversation) {
        return;
      }
      this.router.navigate([`${routing.chat.url()}`, selectedConversation.conversationId]);

      this.setMessageListLoading$.next(true);
      return this.chatInfra
        .getConversationContent(selectedConversation)
        .subscribe((conversationDetails: ConversationDetails) => {
          this.setMessageList$.next(conversationDetails.messageList);
          this.setMemberIdMap$.next(
            new Map(
              conversationDetails.memberList.map((member) => [
                member.id,
                member
              ])
            )
          );
          this.setMessageListLoading$.next(false);
        });
    });

    register(this.chatInfra.loadConversationListPing$, () => {
      this.setConversationList$.next([]);
      this.chatInfra
        .fetchConversations()
        .pipe(take(1))
        .subscribe((conversationList) => {
          this.setConversationList$.next(conversationList);
        });
    });

    register(this.loadConversationList$, () => {
      this.setConversationListLoading$.next(true);
      this.setConversationList$.next([]);
      this.chatInfra
        .fetchConversations()
        .pipe(take(1))
        .subscribe((conversationList) => {
          this.setConversationList$.next(conversationList);
          if (conversationList[0]) {
            this.selectConversation$.next(conversationList[0]);
          }
          this.setConversationListLoading$.next(false);
        });
    });
  });

}
