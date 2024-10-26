import { inject, Pipe, PipeTransform } from '@angular/core';
import { ChatStore, Conversation } from '@chat-app/domain';

@Pipe({
  standalone: true,
  name: 'isActive'
})
export class IsActivePipe implements PipeTransform {

  readonly #selectedConversation = inject(ChatStore).selectedConversation;

  transform(conversation: Conversation): boolean {
    return conversation.conversationId === this.#selectedConversation()?.conversationId;
  }
}
