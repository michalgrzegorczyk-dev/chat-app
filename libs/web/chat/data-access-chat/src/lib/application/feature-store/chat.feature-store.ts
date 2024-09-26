import { Injectable, inject, Inject } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
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
import { DataSyncStrategy } from '../data-sync-strategy/data-sync.strategy';
import { CHAT_SYNC_STRATEGY_TOKEN } from '../../../../../../../../apps/web/src/app/layout/chat/chat.component';

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
  private readonly router = inject(Router);
  private readonly chatInfra = inject(ChatInfra);
  private readonly dataSync = inject(CHAT_SYNC_STRATEGY_TOKEN) as DataSyncStrategy;

  // TODO, weird constructor
  constructor() {
    const effects = rxEffects(({ register }) => {
      register(this.dataSync.getQueue$(), (queue) => {
        this.queue$.next(queue);
      });

      register(this.dataSync.getMessageSent$(), (x) => {
        this.getMessageSent$.next(x);
      });

      register(this.dataSync.getSendMessage$(), (messageSend) => {
        this.chatInfra.sendMessage(messageSend);
      });

      register(this.chatInfra.sendMessageSuccess$, (message) => {
        this.dataSync.notifyMessageSent(message);
      });

      register(this.sendMessage$, (messageSend) => {
        this.dataSync.addMessage(messageSend);
        this.chatInfra.sendMessage(messageSend);
      });

      register(this.selectConversation$, (selectedConversation) => {
        if (!selectedConversation) {
          return;
        }

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

      register(this.selectConversation$, async (conversation) => {
        if (!conversation) {
          return;
        }
        await this.router.navigate([`${routing.chat.url()}`, conversation.conversationId]);
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

  // EVENTS
  readonly sendMessage$ = new Subject<MessageSend>();
  readonly setMessageList$ = new Subject<Message[]>();
  readonly setMessageListLoading$ = new Subject<boolean>();
  readonly setConversationList$ = new Subject<Conversation[]>();
  readonly selectConversation$ = new Subject<Conversation | null>();
  readonly setConversationListLoading$ = new Subject<boolean>();
  readonly addMessage$ = new Subject<Message>();
  readonly setMemberIdMap$ = new Subject<Map<string, User>>();
  readonly loadConversationList$ = new Subject<void>();
  readonly queue$ = new Subject<MessageSend[]>();
  readonly getMessageSent$ = new Subject<ReceivedMessage>();

  private readonly rxState = rxState<ChatState>(({ set, connect }) => {
    set(INITIAL_STATE);

    connect('messageList', this.getMessageSent$, (state:ChatState, message: ReceivedMessage) => {
      if (state.selectedConversation?.conversationId !== message.conversationId) {
        return state.messageList;
      }

      return state.messageList.map((msg:Message) => {
        if (msg.localMessageId === message.localMessageId) {
          return {
            ...msg,
            status: 'sent',
            messageId: message.messageId // Update the server-generated messageId
          };
        }
        return msg;
      });
    });

    connect('conversationListLoading', this.setConversationListLoading$);
    connect('messageList', this.chatInfra.sendMessageSuccess$, (state, message) => {
      this.dataSync.removeMessage(message);
      return state.selectedConversation?.conversationId === message.conversationId ?
        [...state.messageList.map(msg => {
          if (msg.localMessageId === message.localMessageId) {
            const newMsg: Message = {
              ...msg,
              status: 'sent'
            };
            return newMsg;
          }
          return msg;
        })] : state.messageList;
    });
    connect('messageList', this.setMessageList$);
    connect('messageList', this.addMessage$, (state, message) => [...state.messageList, message]);

    connect('messageList', this.queue$, (state, queue) => {
      if(queue && queue.length === 0) {
        return state.messageList;
      }

      if(queue.length > 0 && state.messageList[state.messageList.length - 1].localMessageId !== queue[0].localMessageId) {

        //todo questionable
        const message: Message = {
          localMessageId: queue[0].localMessageId,
          messageId: '',
          senderId: queue[0].userId,
          content: queue[0].content,
          createdAt: new Date().toISOString(),
          status: 'sending'
        };

        return [...state.messageList, message];
      }

      return state.messageList;
    });

    connect('messageList', this.sendMessage$, (state, message) => {
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

}
