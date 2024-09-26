import { Component, inject, HostListener } from '@angular/core';
import {ConversationLoadingComponent} from "../conversation/loading/conversation-loading.component";
import { ChatFeatureStore, ChatFacade } from '@chat-app/domain';
import { ConversationHeaderComponent } from '../conversation/header/conversation-header.component';
import { MessageListComponent } from '../message/list/message-list.component';
import { SendMessageInputComponent } from '../message/send/send-message-input.component';
import { ButtonRemoveComponent } from '@chat-app/ui-button';
import { ConversationComponent } from '../conversation/conversation.component';
import { ConversationDetailsComponent } from '../conversation/details/conversation-details.component';

@Component({
  selector: 'mg-conversation-panel-shell',
  standalone: true,
  imports: [ConversationLoadingComponent, ConversationHeaderComponent, MessageListComponent, SendMessageInputComponent, ButtonRemoveComponent, ConversationComponent, ConversationDetailsComponent],
  templateUrl: './conversation-panel-shell.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `
  ]
})
export class ConversationPanelShellComponent {
  private readonly chatFacade = inject(ChatFacade);
  readonly messageListLoading = this.chatFacade.messageListLoading;
}
