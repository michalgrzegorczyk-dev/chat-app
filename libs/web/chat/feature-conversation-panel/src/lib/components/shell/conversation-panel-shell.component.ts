import {Component, inject} from "@angular/core";
import {ConversationLoadingComponent} from "../conversation-loading/conversation-loading.component";
import {ConversationDetailsComponent} from "../conversation/conversation.component";
import { ChatStoreService } from '@chat-app/domain';

// nazwalbym to jakos inaczej niz shell. moze po prostu conversation-panel? shell raczej stosuje sie do wiekszych rzeczy (w momencie gdy renderujesz cale funkcjonalnosci, a nie robisz prosty switch isloading)
@Component({
  selector: 'lib-conversation-panel-shell',
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
