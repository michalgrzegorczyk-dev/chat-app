import { Routes } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';
import { ChatComponent } from './layout/chat/chat.component';
import { AuthGuard } from '@chat-app/util-auth';
import {
  ConversationPanelShellComponent
} from '../../../../libs/web/chat/feature-conversation-panel/src/lib/components/shell/onversation-panel-shell.component';

export const ROUTES = {
  AUTH: 'auth',
  CHAT: 'chat',
  USERS: 'users'
};

export const ROUTES_PARAMS = {
  CONVERSATION_ID: 'conversationId',
  USER_ID: 'userId',
}

const CHAT_ROOT = '/chat';

export const CHAT_ROUTES = {
  root: CHAT_ROOT,
  CONVERSATION_DETAILS: {
    GET: `${CHAT_ROOT}/conversations`,
  },
}

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: ROUTES.AUTH,
    pathMatch: 'full'
  },
  {
    path: ROUTES.AUTH,
    component: LoginComponent
  },
  {
    path: ROUTES.CHAT,
    canActivate: [AuthGuard],
    component: ChatComponent,
    children: [
      {
        path: `:${ROUTES_PARAMS.CONVERSATION_ID}`,
        component: ConversationPanelShellComponent
      }
    ]
  }
];
