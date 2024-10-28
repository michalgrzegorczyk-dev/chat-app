import { ChangeDetectionStrategy, Component, effect, inject, signal } from "@angular/core";
import { ChatStore } from "@chat-app/domain";

import { ConversationComponent } from "./conversation/conversation.component";
import { ConversationDetailsComponent } from "./conversation/details/conversation-details.component";
import { ConversationHeaderComponent } from "./conversation/header/conversation-header.component";
import { ConversationLoadingComponent } from "./conversation/loading/conversation-loading.component";
import { MessageListComponent } from "./message/list/message-list.component";
import { SendMessageInputComponent } from "./message/send/send-message-input.component";

@Component({
  selector: "mg-conversation-panel-shell",
  standalone: true,
  imports: [
    ConversationLoadingComponent,
    ConversationHeaderComponent,
    MessageListComponent,
    SendMessageInputComponent,
    ConversationComponent,
    ConversationDetailsComponent,
  ],
  templateUrl: "./conversation-panel-layout.component.html",
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationPanelLayoutComponent {
  showDetails = signal(false);
  readonly #store = inject(ChatStore);
  readonly messageListLoading = this.#store.messageListLoading;
  readonly selectedConversation = this.#store.selectedConversation;

  closeConversationDetails() {
    this.showDetails.set(false);
  }

  openConversationDetails() {
    console.log("hello");
    this.showDetails.set(true);
  }

  updateConversationName(name: string) {
    console.log(name);
    this.#store.updateConversationName(name);
  }
}
