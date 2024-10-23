import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageStatus } from '@chat-app/dtos';
import { NetworkService } from '@chat-app/network';
import { routes } from '@chat-app/util-routing';
import { User } from '@chat-app/web/shared/util/auth';
import { rxState } from '@rx-angular/state';
import { rxEffects } from '@rx-angular/state/effects';
import { Subject, first } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  ChatState,
  Conversation,
  ConversationDetails,
  Message,
  MessageSendDto,
  ReceivedMessage,
} from '../../models';
import { ChatInfrastructureRest } from '../../infrastructure/chat.infrastructure-rest';
import { ChatInfrastructureWebSockets } from '../../infrastructure/chat.infrastructure-ws';

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
  readonly sendMessageEvent$ = new Subject<MessageSendDto>();
  readonly addMessageOptimistic$ = new Subject<MessageSendDto>();
  readonly setMessageList$ = new Subject<Message[]>();
  readonly setMessageListLoading$ = new Subject<boolean>();
  readonly setConversationList$ = new Subject<Conversation[]>();
  readonly selectConversation$ = new Subject<Conversation | null>();
  readonly setConversationListLoading$ = new Subject<boolean>();
  readonly setMemberIdMap$ = new Subject<Map<string, User>>();
  readonly loadConversationList$ = new Subject<void>();
  readonly messageReceived$ = new Subject<ReceivedMessage>();

  readonly #router = inject(Router);
  readonly #chatInfrastructureRest = inject(ChatInfrastructureRest);
  readonly #chatInfrastructureWebSockets = inject(ChatInfrastructureWebSockets);
  readonly #network = inject(NetworkService);

  effects = rxEffects(({ register }) => {
    register(this.#chatInfrastructureWebSockets.messageReceived$, (message) => {
      return this.messageReceived$.next(message);
    });

    register(this.sendMessageEvent$.pipe(), (messageSend) => {
      if (this.#network.isOnline()) {
        this.#chatInfrastructureWebSockets.sendMessageWebSocket(messageSend);
      } else {
        const array: MessageSendDto[] = JSON.parse(localStorage.getItem('offlineMessage') ?? '[]');
        array.push(messageSend);
        localStorage.setItem('offlineMessage', JSON.stringify(array));
        this.addMessageOptimistic$.next(messageSend);
      }
    });

    register(this.selectConversation$, async (selectedConversation) => {
      if (!selectedConversation) {
        return;
      }
      await this.#router.navigate([`${routes.chat.url()}`, selectedConversation.conversationId]);

      this.setMessageListLoading$.next(true);
      return this.#chatInfrastructureRest
        .getConversationContent(selectedConversation)
        .pipe(first())
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

    // register(this.#chatInfrastructureWebSockets.loadConversationListPing$, () => {
    //   this.setConversationList$.next([]);
    //   this.#chatInfrastructure
    //     .fetchConversations()
    //     .pipe(first())
    //     .subscribe((conversationList) => {
    //       this.setConversationList$.next(conversationList);
    //     });
    // });

    register(this.loadConversationList$, () => {
      this.setConversationListLoading$.next(true);
      this.setConversationList$.next([]);
      this.#chatInfrastructureRest
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

  readonly #rxState = rxState<ChatState>(({ set, connect }) => {
    set(INITIAL_STATE);

    connect('messageList', this.messageReceived$, (state: ChatState, receivedMessage: ReceivedMessage) => {
      if (state.selectedConversation?.conversationId !== receivedMessage.conversationId) {
        return state.messageList;
      }

      // TODO: maybe not the best data structure for frequent updates
      return state.messageList.map((currentMessage: Message) => {
        if (currentMessage.localMessageId === receivedMessage.localMessageId) {
          return {
            ...currentMessage,
            status: 'sent' as MessageStatus,
            messageId: receivedMessage.messageId
          };
        }
        return currentMessage;
      });
    });

    connect('conversationListLoading', this.setConversationListLoading$);
    connect('messageList', this.#chatInfrastructureWebSockets.messageReceived$, (state, message) => {

      if (state.selectedConversation?.conversationId === message.conversationId) {

        for (const msg of state.messageList) {
          if (msg.localMessageId === message.localMessageId) {
            return state.messageList;
          }
        }
        return [...state.messageList, message];
      }

      return state.messageList;
    });
    connect('messageList', this.setMessageList$);
    connect('messageList', this.addMessageOptimistic$, (state, message) => {
      console.log(message);
      const newMessage: Message = {
        createdAt: new Date().toISOString(),
        localMessageId: message.localMessageId,
        messageId: '',
        content: message.content,
        status: 'sending',
        senderId: message.userId
      };
      return [...state.messageList, newMessage];
    });
    connect('conversationList', this.setConversationList$);
    connect('conversationList', this.#chatInfrastructureWebSockets.loadConversationListSuccess$);
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
  readonly messageList = this.#rxState.signal('messageList');
  readonly messageListLoading = this.#rxState.signal('messageListLoading');
  readonly conversationList = this.#rxState.signal('conversationList');
  readonly conversationListLoading = this.#rxState.signal('conversationListLoading');
  readonly selectedConversation = this.#rxState.signal('selectedConversation');
  readonly memberIdMap = this.#rxState.signal('memberIdMap');

  constructor() {
    this.#network.onlineStatus$.subscribe((isOnline) => {
      if (isOnline) {
        const array: MessageSendDto[] = JSON.parse(localStorage.getItem('offlineMessage') ?? '[]');
        array.forEach((message) => {
          this.sendMessageEvent$.next(message);
        });
        localStorage.setItem('offlineMessage', '[]');
      }
    });
  }
}
