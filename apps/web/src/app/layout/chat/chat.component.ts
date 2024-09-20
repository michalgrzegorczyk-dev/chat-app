import {
  Component,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { AccountWidgetComponent } from '@chat-app/feature-account';
import { ConversationListShellComponent } from '@chat-app/feature-conversation-list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mg-chat',
  standalone: true,
  imports: [
    AccountWidgetComponent,
    ConversationListShellComponent,
    RouterOutlet,
  ],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.user;
}
