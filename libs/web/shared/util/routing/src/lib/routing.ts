export const ROUTES = {
  AUTH: 'auth',
  CHAT: 'chat',
  USERS: 'users'
};

export const ROUTES_PARAMS = {
  CONVERSATION_ID: 'conversationId',
  USER_ID: 'userId'
};

const CHAT_ROOT = '/chat';

export const CHAT_ROUTES = {
  root: CHAT_ROOT,
  CONVERSATION_DETAILS: {
    GET: `${CHAT_ROOT}/conversations`
  }
};

// export const appRoutes: Routes = [
//   {
//     path: '',
//     redirectTo: ROUTES.AUTH,
//     pathMatch: 'full',
//   },
//   {
//     path: ROUTES.AUTH,
//     component: LoginComponent,
//   },
//   {
//     path: ROUTES.CHAT,
//     canActivate: [AuthGuard],
//     component: ChatC

export const routing = {
  chat: {
    path: () => ROUTES.CHAT,
    url: () => `/${ROUTES.CHAT}`,
    conversation: {
      path: () => `:${ROUTES_PARAMS.CONVERSATION_ID}`
    }
  },
  auth: {
    path: () => ROUTES.AUTH,
    url: () => `/${ROUTES.AUTH}`
  }
};
