import { Injectable, inject } from '@angular/core';
import { Message, Conversation, User, ChatStore, MessageSend } from '@chat-app/domain';
import { DataSyncer } from './data-syncer/data-syncer.service';

@Injectable({
  providedIn: 'root'
})
export class ChatFacade {

  private readonly chatStore = inject(ChatStore);
  private readonly dataSyncer = inject(DataSyncer);


  sendMessage(messageSend: MessageSend): void {
    this.chatStore.sendMessage(messageSend);
  }

  loadConversationList(): void {
    this.chatStore.loadConversationList();
  }

  setMessageList(messageList: Message[]): void {
    this.chatStore.setMessageList(messageList);
  }

  selectConversation(conversation: Conversation): void {
    this.chatStore.selectConversation(conversation);
  }

  setMemberMap(memberMap: Map<string, User>): void {
    this.chatStore.setMemberMap(memberMap);
  }
}
