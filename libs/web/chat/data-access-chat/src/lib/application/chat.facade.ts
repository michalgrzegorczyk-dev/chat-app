import { Injectable, inject } from '@angular/core';
import { Message, Conversation, User, ChatStore, MessageSend } from '@chat-app/domain';
import { DataSyncer } from './data-syncer/data-syncer.service';

@Injectable({
  providedIn: 'root'
})
export class ChatFacade {

  private readonly chatStore = inject(ChatStore);
  private readonly dataSyncer = inject(DataSyncer);


  // READ
  readonly messageList = this.chatStore.messageList;
  readonly messageListLoading = this.chatStore.messageListLoading;
  readonly conversationList = this.chatStore.conversationList;
  readonly conversationListLoading = this.chatStore.conversationListLoading;
  readonly selectedConversation = this.chatStore.selectedConversation;
  readonly selectedConversationLoading = this.chatStore.selectedConversationLoading;
  readonly memberIdMap = this.chatStore.memberIdMap;

  sendMessage(messageSend: MessageSend): void {
    this.chatStore.sendMessage$.next(messageSend)
  }

  loadConversationList(): void {
    this.chatStore.loadConversationList$.next();
  }

  setMessageList(messageList: Message[]): void {
    this.chatStore.setMessageList$.next(messageList);
  }

  selectConversation(conversation: Conversation): void {
    this.chatStore.selectConversation$.next(conversation);
  }

  setMemberMap(memberMap: Map<string, User>): void {
    this.chatStore.setMemberIdMap$.next(memberMap);
  }
}
