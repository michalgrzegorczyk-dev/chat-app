import { Injectable, inject } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ChatInfrastructureService } from '../infrastructure/chat-infrastructure.service';
import { ChatState } from '../models/chat-state.type';
import { Message } from '../models/message.type';
import { Conversation } from '../models/conversation.type';
import { MessageSend } from '../models/message-send.type';
import { User } from '../models/user.type';
import { setupChatEffects } from './store/effects';
import { updateConversationList, receiveMessage, selectConversation } from './store/helper';

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
  readonly setMessageList$ = new Subject<Message[]>();
  readonly setMessageListLoading$ = new Subject<boolean>();
  readonly setConversationList$ = new Subject<Conversation[]>();
  readonly selectConversation$ = new Subject<Conversation | null>();
  readonly setConversationListLoading$ = new Subject<boolean>();
  readonly addMessage$ = new Subject<Message>();
  readonly setMemberIdMap$ = new Subject<Map<string, User>>();
  readonly loadConversationList$ = new Subject<void>();
  readonly updateConversationList$ = new Subject<MessageSend>();

  private readonly effects = setupChatEffects(this);

  private readonly rxState = rxState<ChatState>(({ set, connect }) => {
    set(INITIAL_STATE);
    connect('conversationListLoading', this.setConversationListLoading$, (state, conversationListLoading) => conversationListLoading);
    connect('conversationList', this.updateConversationList$, updateConversationList());
    connect(this.chatInfrastructureService.receiveMessage$, receiveMessage());
    connect('messageList', this.setMessageList$);
    connect('messageList', this.addMessage$, (state, message) => [...state.messageList, message]);
    connect('conversationList', this.setConversationList$, (state, conversationList) => conversationList);
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

  loadConversationList = (): void => this.loadConversationList$.next();
  setMessageList = (messageList: Message[]): void => this.setMessageList$.next(messageList);
  selectConversation = (conversation: Conversation): void => this.selectConversation$.next(conversation);
  setMemberMap = (memberMap: Map<string, User>): void => this.setMemberIdMap$.next(memberMap);

  sendMessage(messageSend: MessageSend): void {
    this.chatInfrastructureService.sendMessage(messageSend);
    this.updateConversationList$.next(messageSend);
  }
}
