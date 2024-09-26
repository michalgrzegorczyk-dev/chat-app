import { ChatStore } from './store/chat.store';
import { MessageSend } from '../models/message-send.type';
import { Conversation } from '../models/conversation.type';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class ChatFacade {
  private readonly chatStore = inject(ChatStore);

  readonly messageList = this.chatStore.messageList;
  readonly messageListLoading = this.chatStore.messageListLoading;
  readonly conversationList = this.chatStore.conversationList;
  readonly conversationListLoading = this.chatStore.conversationListLoading;
  readonly selectedConversation = this.chatStore.selectedConversation;
  readonly memberIdMap = this.chatStore.memberIdMap;

  sendMessage(messageSend: MessageSend): void {
    this.chatStore.sendMessage$.next(messageSend);
  }

  loadConversationList(): void {
    this.chatStore.loadConversationList$.next();
  }

  selectConversation(conversation: Conversation): void {
    this.chatStore.selectConversation$.next(conversation);
  }

  requestSync(): void {
    console.log('load');
    // this.chatStore.chatSync.requestSync();
  }
}
