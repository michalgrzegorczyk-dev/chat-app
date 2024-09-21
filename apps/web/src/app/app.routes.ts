import { Routes } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';
import { ChatComponent } from './layout/chat/chat.component';
import { AuthGuard } from '@chat-app/web/shared/util/auth';
import { ConversationPanelShellComponent } from '@chat-app/feature-conversation-panel';
import { routing } from '@chat-app/util-routing';


export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: `${routing.auth.path()}`,
    pathMatch: 'full'
  },
  {
    path: `${routing.auth.path()}`,
    component: LoginComponent
  },
  {
    path: `${routing.chat.path()}`,
    canActivate: [AuthGuard],
    component: ChatComponent,
    children: [
      {
        path: `${routing.chat.conversation.path()}`,
        component: ConversationPanelShellComponent
      }
    ]
  }
];
