import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { v4 as uuidv4 } from 'uuid';
import { ChatStore } from '@chat-app/domain';
import { MessageSendDto } from '@chat-app/dtos';

@Component({
  selector: 'mg-send-message-input',
  standalone: true,
  templateUrl: './send-message-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule]
})
export class SendMessageInputComponent {
  readonly user = inject(AuthService).user;
  protected inputMessage = '';
  readonly #store = inject(ChatStore);
  readonly selectedConversation = this.#store.selectedConversation;

  sendMessage(): void {
    const selectedConversation = this.#store.selectedConversation();

    if (this.inputMessage.trim() !== '' && selectedConversation) {
      const messageToSend: MessageSendDto = {
        localMessageId: uuidv4(),
        conversationId: selectedConversation.conversationId,
        userId: this.user().id,
        content: this.inputMessage.trim(),
        timestamp: new Date().toISOString(),
        status: 'sending'
      };
      this.#store.sendMessage(messageToSend);
      this.inputMessage = '';
    }
  }
}
