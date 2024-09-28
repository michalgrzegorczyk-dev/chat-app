import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { AccountWidgetComponent } from '@chat-app/feature-account';
import { ConversationListLayoutComponent } from '@chat-app/feature-conversation-list';
import { RouterOutlet } from '@angular/router';
import { DataSyncer, WithDataSync, ChatFacade, ChatFeatureStore, DATA_SYNC_STRATEGY_TOKEN, ChatInfra } from '@chat-app/domain';
import {
  NetworkService
} from '../../../../../../libs/web/chat/data-access-chat/src/lib/util-network/network.service';

@Component({
  selector: 'mg-chat',
  standalone: true,
  imports: [AccountWidgetComponent, ConversationListLayoutComponent, RouterOutlet],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DATA_SYNC_STRATEGY_TOKEN,
      useClass: WithDataSync
    },
    ChatInfra,
    ChatFacade,
    ChatFeatureStore,
    DataSyncer,
    NetworkService
  ]
})
export class ChatComponent implements OnInit {
  readonly user = inject(AuthService).user;

  ngOnInit() {
    console.log('CHAT NG ON INIT', this.user().name);
  }
}
