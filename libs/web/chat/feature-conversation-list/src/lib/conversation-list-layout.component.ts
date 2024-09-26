import {Component, inject, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {ConversationListLoadingComponent} from "./conversation-list-loading/conversation-list-loading.component";
import {ConversationsComponent} from "./conversation-list/converstaion-list.component";
import {JsonPipe} from "@angular/common";
import { ChatFeatureStore, Conversation, ChatFacade } from '@chat-app/domain';
import { RelativeTimePipe } from './relative-time.pipe';

@Component({
  selector: 'mg-conversation-list-layout',
  standalone: true,
  imports: [ConversationListLoadingComponent, ConversationsComponent, JsonPipe, RelativeTimePipe],
  templateUrl: './conversation-list-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationListLayoutComponent implements OnInit {
  private readonly chatStore = inject(ChatFacade);
  readonly conversationListLoading = this.chatStore.conversationListLoading;
  readonly conversationList = this.chatStore.conversationList;
  readonly selectedConversation = this.chatStore.selectedConversation;

  ngOnInit(): void {
    this.chatStore.loadConversationList();
  }

  clickedConversation(conversation: Conversation): void {
    this.chatStore.selectConversation(conversation);
  }

  deleteConversation(conversation: Conversation): void {
    // todo: implement :)
  }
}
