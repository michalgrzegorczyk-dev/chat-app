import { Component, inject, ChangeDetectionStrategy, InjectionToken } from '@angular/core';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { AccountWidgetComponent } from '@chat-app/feature-account';
import { ConversationListLayoutComponent } from '@chat-app/feature-conversation-list';
import { RouterOutlet } from '@angular/router';
import { SyncStrategy, ChatSyncStrategy } from '@chat-app/domain';

export const CHAT_SYNC_STRATEGY_TOKEN = new InjectionToken<SyncStrategy>('syncStrategy');

@Component({
  selector: 'mg-chat',
  standalone: true,
  imports: [AccountWidgetComponent, ConversationListLayoutComponent, RouterOutlet],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CHAT_SYNC_STRATEGY_TOKEN,
      useClass: ChatSyncStrategy
    }
  ]
})
export class ChatComponent {
  readonly user = inject(AuthService).user;
}
