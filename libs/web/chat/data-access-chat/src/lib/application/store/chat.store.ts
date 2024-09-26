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
import { NotifierService } from '@chat-app/ui-notifier';
import { rxEffects } from '@rx-angular/state/effects';
import { ConversationDetails } from '../../models/conversation-details.type';
import { routing } from '@chat-app/util-routing';
import { take } from 'rxjs/operators';
import { SyncStrategy } from './chat.strategy';
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
export class ChatStore {
  readonly router = inject(Router);
  readonly chatInfrastructureService = inject(ChatInfra);
  readonly notifier = inject(NotifierService);

  //todo constructor?
  constructor(@Inject(CHAT_SYNC_STRATEGY_TOKEN) readonly chatSync: SyncStrategy) {

    this.chatSync.getMessageSent$().subscribe(message => {
      this.getMessageSent$.next(message);
    });

    this.chatSync.getQueue$().subscribe(queue => {
      this.queue$.next(queue);
    });



    const effects = rxEffects(({ register }) => {
      register(this.chatSync.getSendMessage$(), (messageSend) => {
        this.notifier.notify('info', '[FROM SYNC] Send Message.');
        this.chatInfrastructureService.sendMessage(messageSend);
      });


      register(this.chatInfrastructureService.sendMessageSuccess$, (message) => {
        this.chatSync.notifyMessageSent(message);
      });


      register(this.sendMessage$, (messageSend) => {
        this.notifier.notify('info', 'Send Message.');
        this.chatSync.addMessage(messageSend);
        console.log('sending message');
        this.chatInfrastructureService.sendMessage(messageSend);
      });

      register(this.selectConversation$, (selectedConversation) => {
        if (!selectedConversation) {
          return;
        }

        this.setMessageListLoading$.next(true);
        return this.chatInfrastructureService
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

      register(this.chatInfrastructureService.loadConversationListPing$, () => {
        this.setConversationList$.next([]);
        this.chatInfrastructureService
          .fetchConversations()
          .pipe(take(1))
          .subscribe((conversationList) => {
            this.setConversationList$.next(conversationList);
          });
      });

      register(this.loadConversationList$, () => {
        this.setConversationListLoading$.next(true);
        this.setConversationList$.next([]);
        this.chatInfrastructureService
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

    // connect('messageList', this.getMessageSent$, (state:ChatState, message: ReceivedMessage) => {
    //   this.notifier.notify('success', 'Message Sent');
    //   if (state.selectedConversation?.conversationId !== message.conversationId) {
    //     return state.messageList;
    //   }
    //
    //   return state.messageList.map((msg:Message) => {
    //     if (msg.localMessageId === message.localMessageId) {
    //       return {
    //         ...msg,
    //         status: 'sent',
    //         messageId: message.messageId // Update the server-generated messageId
    //       };
    //     }
    //     return msg;
    //   });
    // });

    connect('conversationListLoading', this.setConversationListLoading$);
    connect('messageList', this.chatInfrastructureService.sendMessageSuccess$, (state, message) => {
      this.chatSync.removeMessage(message);
      this.notifier.notify('success', 'Message Sent');
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
    connect('messageList', this.setMessageList$, (state, list) => {
      this.notifier.notify('default', 'Messages SET.');
      return list;
    });
    connect('messageList', this.addMessage$, (state, message) => {
      this.notifier.notify('default', 'Message added.');
      return [...state.messageList, message];
    });

    // esz
    connect('messageList', this.queue$, (state, queue) => {
      // return state.messageList;

      if(queue && queue.length === 0) {
        return state.messageList;
      }

      if(queue.length > 0 && state.messageList[state.messageList.length - 1].localMessageId !== queue[0].localMessageId) {
        // alert('yooo');
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


      // this.notifier.notify('default', 'Message added.');
      // return [...state.messageList, message];
    });
    connect('messageList', this.sendMessage$, (state, message) => {
      this.notifier.notify('default', 'Message displayed on UI');
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
    connect('conversationList', this.chatInfrastructureService.loadConversationListSuccess$);
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
