import {JsonPipe} from "@angular/common";
import {ChangeDetectionStrategy,Component, inject, OnInit} from "@angular/core";
import { ChatFacade, Conversation } from '@chat-app/domain';

import {ConversationsComponent} from "./conversation-list/converstaion-list.component";
import {ConversationListLoadingComponent} from "./conversation-list-loading/conversation-list-loading.component";
import { RelativeTimePipe } from './relative-time.pipe';

@Component({
  selector: 'mg-conversation-list-layout',
  standalone: true,
  imports: [ConversationListLoadingComponent, ConversationsComponent, JsonPipe, RelativeTimePipe],
  templateUrl: './conversation-list-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationListLayoutComponent implements OnInit {
  readonly #chatStore = inject(ChatFacade);
  readonly conversationListLoading = this.#chatStore.conversationListLoading;
  readonly conversationList = this.#chatStore.conversationList;
  readonly selectedConversation = this.#chatStore.selectedConversation;

  ngOnInit(): void {
    this.#chatStore.loadConversationList();
  }

  clickedConversation(conversation: Conversation): void {
    this.#chatStore.selectConversation(conversation);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteConversation(conversation: Conversation): void {
    // todo: implement :)
  }
}
