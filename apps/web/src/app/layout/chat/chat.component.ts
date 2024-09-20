import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { ChatStoreService } from '@chat-app/domain';
import { AccountWidgetComponent } from '@chat-app/feature-account';
import { ConversationListShellComponent } from '@chat-app/feature-conversation-list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    AccountWidgetComponent,
    ConversationListShellComponent,
    RouterOutlet,
  ],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.user;
  private readonly chatStore = inject(ChatStoreService);

  ngOnInit(): void {
    this.chatStore.loadConversationList();
  }
}
