import { AsyncPipe, DatePipe,JsonPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, Pipe, PipeTransform } from '@angular/core';
import { ChatFacade, Conversation } from '@chat-app/domain';
import { ButtonComponent, ButtonRemoveComponent } from '@chat-app/ui-button';
import { ModalService } from '@chat-app/ui-modal';
import { AuthService } from '@chat-app/web/shared/util/auth';

import { ConversationAddComponent } from '../conversation-add/conversation-add.component';
import { ConversationRemoveComponent } from '../conversation-remove/conversation-remove.component';
import { RelativeTimePipe } from '../relative-time.pipe';


@Pipe({
  standalone: true,
  name: 'isActive'
})
export class IsActivePipe implements PipeTransform {

  private readonly selectedConversation = inject(ChatFacade).selectedConversation;

  transform(conversation: Conversation): boolean {
    return conversation.conversationId === this.selectedConversation()?.conversationId;
  }
}


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
    IsActivePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationsComponent {
  readonly conversationList = input.required<Conversation[]>();

  readonly clickConversation = output<Conversation>();
  readonly user = inject(AuthService).user;
  private readonly modalService = inject(ModalService);

  conversationClicked(conversation: Conversation): void {
    this.clickConversation.emit(conversation);
  }

  removedConversation(conversation: Conversation): void {
    this.modalService.open(ConversationRemoveComponent, `Remove Conversation: ${conversation.name}`);
  }

  addNewConversation(): void {
    this.modalService.open(ConversationAddComponent, 'Add New Conversation');
  }
}

