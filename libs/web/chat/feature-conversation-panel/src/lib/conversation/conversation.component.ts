import {Component, ChangeDetectionStrategy} from "@angular/core";
import {DatePipe, NgForOf, NgClass, NgIf, JsonPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { ConversationHeaderComponent } from './header/conversation-header.component';
import { MessageListComponent } from '../message/list/message-list.component';
import { SendMessageInputComponent } from '../message/send/send-message-input.component';
import { ButtonRemoveComponent } from '@chat-app/ui-button';
import { ConversationDetailsComponent } from './details/conversation-details.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationComponent {

}
