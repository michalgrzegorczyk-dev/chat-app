import { inject, Injectable } from '@angular/core';

import { Conversation } from '../models/conversation.type';
import { MessageSend } from '../models/message-send.type';

import { ChatFeatureStore } from './feature-store/chat.feature-store';

@Injectable()
export class ChatFacade {
  readonly #chatStore = inject(ChatFeatureStore);

  readonly messageList = this.#chatStore.messageList;
  readonly messageListLoading = this.#chatStore.messageListLoading;
  readonly conversationList = this.#chatStore.conversationList;
  readonly conversationListLoading = this.#chatStore.conversationListLoading;
  readonly selectedConversation = this.#chatStore.selectedConversation;
  readonly memberIdMap = this.#chatStore.memberIdMap;

  sendMessage(messageSend: MessageSend): void {
    this.#chatStore.sendMessageEvent$.next(messageSend);
  }

  loadConversationList(): void {
    this.#chatStore.loadConversationList$.next();
  }

  selectConversation(conversation: Conversation): void {
    this.#chatStore.selectConversation$.next(conversation);
  }
}
