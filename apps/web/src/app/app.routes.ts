import { Routes } from '@angular/router';
import { ConversationPanelLayoutComponent } from '@chat-app/feature-conversation-panel';
import { routes } from '@chat-app/util-routing';
import { AuthGuard } from '@chat-app/web/shared/util/auth';

import { ChatComponent } from './layout/chat/chat.component';
import { LoginComponent } from './layout/login/login.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: `${routes.auth.path}`,
    pathMatch: 'full'
  },
  {
    path: `${routes.auth.path}`,
    component: LoginComponent
  },
  {
    path: `${routes.chat.path}`,
    canActivate: [AuthGuard],
    component: ChatComponent,
    children: [
      {
        path: `${routes.chat.conversation.path}`,
        component: ConversationPanelLayoutComponent
      }
    ]
  },
  {
    path: `${routes.account.path}`,
    loadComponent: () => import('../app/layout/account/account.component').then(c => c.AccountComponent)
  }
];
