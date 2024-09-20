import {Component, inject} from "@angular/core";
import {ConversationLoadingComponent} from "../conversation/loading/conversation-loading.component";
import { ChatStoreService } from '@chat-app/domain';
import { ConversationDetailsComponent } from '../conversation/conversation.component';

@Component({
  selector: 'mg-conversation-panel-shell',
  standalone: true,
  imports: [ConversationLoadingComponent, ConversationDetailsComponent],
  templateUrl: './conversation-panel-shell.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `
  ]
})
export class ConversationPanelShellComponent {
  readonly messageListLoading = inject(ChatStoreService).messageListLoading;
}
