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
  private readonly notifier: NotifierService;

  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  readonly messageTrigger$ = this.messageSync.messageTrigger$;
  readonly messageTriggerSuccess$ = this.messageSync.messageTriggerSuccess$;

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

  private readonly rxState = rxState<ChatState>(({ set, connect }) => {
    set(INITIAL_STATE);
    connect('conversationListLoading', this.setConversationListLoading$);
    connect('messageList', this.chatInfrastructureService.sendMessageSuccess$, (state, msg) => {
      this.notifier.notify('success', 'Message was sent successfully!');
      return sendMessageSuccess(state, msg);
    });
    connect('messageList', this.setMessageList$);
    connect('messageList', this.addMessage$, (state, message) => [...state.messageList, message]);
    connect('messageList', this.sendMessage$, (state, message) => [...state.messageList, {
      localMessageId: message.localMessageId,
      messageId: '',
      senderId: message.userId,
      content: message.content,
      createdAt: new Date().toISOString(),
      status: 'sending'
    }]);
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
