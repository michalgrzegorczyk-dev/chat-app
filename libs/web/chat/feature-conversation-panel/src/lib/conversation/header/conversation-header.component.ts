import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChatStore } from '@chat-app/domain';

@Component({
  selector: 'mg-conversation-header',
  templateUrl: './conversation-header.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationHeaderComponent {
  readonly #store = inject(ChatStore);
  selectedConversation = this.#store.selectedConversation;
}
