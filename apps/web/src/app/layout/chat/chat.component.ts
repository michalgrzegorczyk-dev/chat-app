import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountWidgetComponent } from '@chat-app/feature-account';
import { ConversationListLayoutComponent } from '@chat-app/feature-conversation-list';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { ChatStore, ChatInfrastructureRest, ChatInfrastructureWebSockets, NetworkService } from '@chat-app/domain';

@Component({
  selector: 'mg-chat',
  standalone: true,
  imports: [AccountWidgetComponent, ConversationListLayoutComponent, RouterOutlet],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ChatStore,
    ChatInfrastructureRest,
    ChatInfrastructureWebSockets,
    NetworkService,
  ]
})
export class ChatComponent {
  readonly user = inject(AuthService).user;

}
