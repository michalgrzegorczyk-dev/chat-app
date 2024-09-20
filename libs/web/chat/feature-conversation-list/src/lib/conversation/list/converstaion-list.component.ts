import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  inject,
} from '@angular/core';
import { NgClass, JsonPipe, AsyncPipe, DatePipe } from '@angular/common';
import { RelativeTimePipe } from '../../relative-time.pipe';
import { ButtonComponent, ButtonRemoveComponent } from '@chat-app/ui-button';
// import { Conversation } from '@chat-app/domain';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { ModalService } from '@chat-app/ui-modal';
import { Conversation } from '@chat-app/domain';
import { ConversationAddComponent } from '../add/conversation-add.component';
import { ConversationRemoveComponent } from '../remove/conversation-remove.component';

@Component({
  selector: 'mg-conversation-list',
  templateUrl: './conversation-list.component.html',
  standalone: true,
  imports: [
    NgClass,
    JsonPipe,
    AsyncPipe,
    ButtonRemoveComponent,
    ButtonComponent,
    ConversationAddComponent,
    DatePipe,
    RelativeTimePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationsComponent {
  conversationList = input.required<Conversation[]>();

  selectConversation = output<Conversation>();
  readonly user = inject(AuthService).user;
  private readonly modalService = inject(ModalService);

  selectedConversation(conversation: Conversation) {
    this.selectConversation.emit(conversation);
  }

  removedConversation(conversation: Conversation) {
    this.modalService.open(
      ConversationRemoveComponent,
      `Remove Conversation: ${conversation.name}`
    );
  }

  addNewConversation() {
    this.modalService.open(ConversationAddComponent, 'Add New Conversation');
  }
}
