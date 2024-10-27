import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ChatStore } from "@chat-app/domain";
import { ButtonRemoveComponent } from "@chat-app/ui-button";

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
    ButtonRemoveComponent,
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
  readonly messageListLoading = inject(ChatStore).messageListLoading;
}
