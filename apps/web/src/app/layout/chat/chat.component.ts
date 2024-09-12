import {Component, inject, ChangeDetectionStrategy, OnInit} from '@angular/core';
// import {AuthService} from "../../shared/auth/utils-auth/auth.service";
// import {AccountComponent} from "../../account/feature-account/account.component";
// import {
//   ConversationsComponent
// } from "../../chat/feature-conversation-list/conversation-list/converstaion-list.component";
// import {RouterOutlet} from "@angular/router";
// import {
//   ConversationPanelShellComponent
// } from "../../chat/feature-conversation-panel/components/shell/onversation-panel-shell.component";
// import {
//   ConversationListShellComponent
// } from "../../chat/feature-conversation-list/shell/conversation-list-shell.component";
// import {ChatStoreService} from "../../chat/domain/application/chat-store/chat-store.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    // AccountComponent,
    // ConversationsComponent,
    // RouterOutlet,
    // ConversationPanelShellComponent,
    // ConversationListShellComponent
  ],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  // private readonly authService = inject(AuthService);
  // readonly user = this.authService.user;
  // private readonly chatStore = inject(ChatStoreService);
  // readonly conversations = this.chatStore.conversationList;
  //
  ngOnInit(): void {
  //   this.chatStore.loadConversationList()
  }
}
