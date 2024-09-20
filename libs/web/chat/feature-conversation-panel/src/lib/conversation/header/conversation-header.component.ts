import {Component, ChangeDetectionStrategy, inject} from "@angular/core";
import { ChatStoreService } from '@chat-app/domain';

@Component({
  selector: 'lib-conversation-header',
  templateUrl: './conversation-header.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationHeaderComponent {
  readonly selectedConversation = inject(ChatStoreService).selectedConversation;
}
