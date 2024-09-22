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
    connect('messageList', this.chatInfrastructureService.sendMessageSuccess$, sendMessageSuccess());
    connect('messageList', this.setMessageList$);
    connect('messageList', this.addMessage$, (state, message) => [...state.messageList, message]);
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
  readonly selectedConversationLoading = this.rxState.signal('selectedConversationLoading');
  readonly memberIdMap = this.rxState.signal('memberIdMap');
}
