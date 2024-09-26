import { Component, inject, ChangeDetectionStrategy, InjectionToken, OnInit } from '@angular/core';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { AccountWidgetComponent } from '@chat-app/feature-account';
import { ConversationListLayoutComponent } from '@chat-app/feature-conversation-list';
import { RouterOutlet } from '@angular/router';
import { DataSyncStrategy, ChatFacade, ChatFeatureStore } from '@chat-app/domain';
import { ChatInfra } from '../../../../../../libs/web/chat/data-access-chat/src/lib/infra/chat.infra';
import { ChatDataSync } from '../../../../../../libs/web/chat/data-access-chat/src/lib/application/data-sync/chat.data-sync';
import {
  WithDataSync
} from '../../../../../../libs/web/chat/data-access-chat/src/lib/application/data-sync-strategy/with-data-sync.service';

export const CHAT_SYNC_STRATEGY_TOKEN = new InjectionToken<DataSyncStrategy>('syncStrategy');

@Component({
  selector: 'mg-chat',
  standalone: true,
  imports: [AccountWidgetComponent, ConversationListLayoutComponent, RouterOutlet],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CHAT_SYNC_STRATEGY_TOKEN,
      useClass: WithDataSync
    },
    ChatInfra,
    ChatFacade,
    ChatFeatureStore,
    ChatDataSync
  ]
})
export class ChatComponent implements OnInit {
  readonly user = inject(AuthService).user;

  ngOnInit() {
    console.log('CHAT NG ON INIT', this.user().name);
  }
}
