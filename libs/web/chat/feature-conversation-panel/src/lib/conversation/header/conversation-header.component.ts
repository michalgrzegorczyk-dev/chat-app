import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import { ChatStore } from '../../../../../data-access-chat/src/lib/application/store/chat.store';
// import { ChatFacade } from '@chat-app/domain';

@Component({
  selector: 'mg-conversation-header',
  templateUrl: './conversation-header.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationHeaderComponent {
  store = inject(ChatStore);
  // readonly selectedConversation = inject(ChatFacade).selectedConversation;
}
