import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { Conversation, NetworkService, ChatStore } from "@chat-app/domain";
import { ConversationsComponent } from "./conversation-list/converstaion-list.component";
import { ConversationListLoadingComponent } from "./conversation-list-loading/conversation-list-loading.component";
import { RelativeTimePipe } from "./relative-time.pipe";

@Component({
  selector: "mg-conversation-list-layout",
  standalone: true,
  imports: [
    ConversationListLoadingComponent,
    ConversationsComponent,
    RelativeTimePipe,
  ],
  templateUrl: "./conversation-list-layout.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationListLayoutComponent implements OnInit {
  readonly #store = inject(ChatStore);
  readonly conversationList = this.#store.conversationList;
  readonly conversationListLoading = this.#store.conversationListLoading;
  readonly #network = inject(NetworkService);

  ngOnInit(): void {
    console.log("INIT");
    this.#store.initializeMessageReceiving();
    this.#store.loadConversationList();
    this.#network.onlineStatus$.subscribe((isOnline) => {
      if (isOnline) {
        this.#store.syncOfflineMessages();
      }
    });
  }

  clickedConversation(conversation: Conversation): void {
    this.#store.selectConversation(conversation);
  }
}
