import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatFacade, ChatFeatureStore, ChatInfrastructure, NetworkService  } from '@chat-app/domain';
import { AccountWidgetComponent } from '@chat-app/feature-account';
import { ConversationListLayoutComponent } from '@chat-app/feature-conversation-list';
import { AuthService } from '@chat-app/web/shared/util/auth';

@Component({
  selector: 'mg-chat',
  standalone: true,
  imports: [AccountWidgetComponent, ConversationListLayoutComponent, RouterOutlet],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ChatInfrastructure,
    ChatFacade,
    ChatFeatureStore,
    NetworkService
  ]
})
export class ChatComponent implements OnInit {
  readonly user = inject(AuthService).user;

  ngOnInit() {
    console.log('CHAT NG ON INIT', this.user().name);
  }
}
