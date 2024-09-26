import {Component, ChangeDetectionStrategy, inject} from "@angular/core";
import { ChatFeatureStore, ChatFacade } from '@chat-app/domain';

@Component({
  selector: 'mg-conversation-header',
  templateUrl: './conversation-header.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationHeaderComponent {
  readonly selectedConversation = inject(ChatFacade).selectedConversation;
}
