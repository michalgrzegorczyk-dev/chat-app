import {Component, inject, OnInit, ChangeDetectionStrategy} from "@angular/core";
import {ConversationListLoadingComponent} from "../conversation/list-loading/conversation-list-loading.component";
import {ConversationsComponent} from "../conversation/list/converstaion-list.component";
import {JsonPipe} from "@angular/common";
import { ChatStoreService, Conversation } from '@chat-app/domain';
import { RelativeTimePipe } from '../relative-time.pipe';

@Component({
  selector: 'mg-conversation-list-shell',
  standalone: true,
  imports: [ConversationListLoadingComponent, ConversationsComponent, JsonPipe, RelativeTimePipe],
  templateUrl: './conversation-list-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationListShellComponent implements OnInit {
  private readonly chatStore = inject(ChatStoreService);
  readonly conversationListLoading = this.chatStore.conversationListLoading;
  readonly conversationList = this.chatStore.conversationList;

  ngOnInit(): void {
    this.chatStore.loadConversationList();
  }

  selectedConversation(conversation: Conversation): void {
    this.chatStore.selectConversation(conversation);
  }

  deleteConversation(conversation: Conversation): void {
    // todo: implement :)
  }
}
