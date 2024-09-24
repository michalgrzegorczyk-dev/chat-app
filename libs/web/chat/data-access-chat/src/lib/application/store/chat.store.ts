import { Injectable, inject } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ChatInfrastructureService } from '../../infrastructure/chat-infrastructure.service';
import { ChatState } from '../../models/chat-state.type';
import { Message } from '../../models/message.type';
import { Conversation } from '../../models/conversation.type';
import { MessageSend } from '../../models/message-send.type';
import { User } from '../../models/user.type';
import { setupChatEffects } from './chat.effects';
import { sendMessageSuccess, selectConversation } from './helper';
import { MessageSyncService } from './message-sync.service';
import { NotifierService } from '@chat-app/ui-notifier';

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
export class ChatStore {
  readonly router = inject(Router);
  readonly chatInfrastructureService = inject(ChatInfrastructureService);
  readonly messageSync = inject(MessageSyncService);
  readonly notifier: NotifierService;

  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  readonly messagesWakeUpTrigger$ = this.messageSync.messageTrigger$;
  readonly messageReadyToSendFromScheduler$ = this.messageSync.messageTriggerSuccess$;

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

  private readonly effects = setupChatEffects(this);
// <button class="button button--primary" (click)="showNotification('default', 'Good evening, you lovely person!')">Default me!</button>
// <button class="button button--primary" (click)="showNotification('info', 'This library is built on top of Angular 2.')">Info me!</button>
// <button class="button button--primary" (click)="showNotification('success', 'Notification successfully opened.')">Success me!</button>
// <button class="button button--primary" (click)="showNotification('warning', 'Warning! But not an error! Just a warning!')">
  private readonly rxState = rxState<ChatState>(({ set, connect }) => {
    set(INITIAL_STATE);
    connect('conversationListLoading', this.setConversationListLoading$);
    connect('messageList', this.chatInfrastructureService.sendMessageSuccess$, (state, msg) => {
      this.notifier.notify('success', 'Message was sent.');
      return sendMessageSuccess(state, msg);
    });
    connect('messageList', this.setMessageList$, (state, list) => {
      this.notifier.notify('default', 'Messages SET.');
      return list;
    });
    connect('messageList', this.addMessage$, (state, message) => {
      this.notifier.notify('default', 'Message added.');
      return [...state.messageList, message];
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
    connect(this.selectConversation$, selectConversation());
  });

  // READ
  readonly messageList = this.rxState.signal('messageList');
  readonly messageListLoading = this.rxState.signal('messageListLoading');
  readonly conversationList = this.rxState.signal('conversationList');
  readonly conversationListLoading = this.rxState.signal('conversationListLoading');
  readonly selectedConversation = this.rxState.signal('selectedConversation');
  readonly memberIdMap = this.rxState.signal('memberIdMap');
}
