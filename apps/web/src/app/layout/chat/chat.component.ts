import { Component, inject, ChangeDetectionStrategy, InjectionToken, OnInit } from '@angular/core';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { AccountWidgetComponent } from '@chat-app/feature-account';
import { ConversationListLayoutComponent } from '@chat-app/feature-conversation-list';
import { RouterOutlet } from '@angular/router';
import { SyncStrategy, ChatSyncStrategy, ChatFacade, ChatStore } from '@chat-app/domain';
import { ChatInfra } from '../../../../../../libs/web/chat/data-access-chat/src/lib/infra/chat.infra';

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
    },
    ChatInfra,
    ChatFacade,
    ChatStore
  ]
})
export class ChatComponent implements OnInit {
  readonly user = inject(AuthService).user;

  ngOnInit() {
    console.log('CHAT NG ON INIT', this.user().name);
  }
}
