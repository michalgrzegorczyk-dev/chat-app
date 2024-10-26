import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonRemoveComponent } from '@chat-app/ui-button';

import { MessageListComponent } from '../message/list/message-list.component';
import { SendMessageInputComponent } from '../message/send/send-message-input.component';

import { ConversationDetailsComponent } from './details/conversation-details.component';
import { ConversationHeaderComponent } from './header/conversation-header.component';
import { ChatStore } from '../../../../data-access-chat/src/lib/application/store/chat.store';

@Component({
  selector: 'mg-conversation',
  standalone: true,
  templateUrl: './conversation.component.html',
  imports: [
    DatePipe,
    FormsModule,
    NgForOf,
    NgClass,
    NgIf,
    ConversationHeaderComponent,
    MessageListComponent,
    SendMessageInputComponent,
    ButtonRemoveComponent,
    ConversationDetailsComponent
  ],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        flex-grow: 1;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationComponent {
}
