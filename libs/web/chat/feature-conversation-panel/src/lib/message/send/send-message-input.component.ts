import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatStore, MessageSend, ChatFacade } from '@chat-app/domain';
import { AuthService } from '@chat-app/web/shared/util/auth';

@Component({
  selector: 'mg-send-message-input',
  standalone: true,
  templateUrl: './send-message-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class SendMessageInputComponent {
  readonly user = inject(AuthService).user;
  protected inputMessage = '';
  private readonly chatStore = inject(ChatFacade);
  readonly selectedConversation = this.chatStore.selectedConversation;

  sendMessage(): void {
    const selectedConversation = this.selectedConversation();

    if (this.inputMessage.trim() !== '' && selectedConversation) {
      const messageToSend: MessageSend = {
        conversationId: selectedConversation.conversationId,
        userId: this.user().id,
        content: this.inputMessage.trim(),
        timestamp: new Date().toISOString(),
        status: 'sending'
      };
      this.chatStore.sendMessage(messageToSend);
      this.inputMessage = '';
    }
  }
}
