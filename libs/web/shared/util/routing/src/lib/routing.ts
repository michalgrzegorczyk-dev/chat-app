export const ROUTES = {
  AUTH: 'auth',
  CHAT: 'chat',
  USERS: 'users',
  ACCOUNT: 'account'
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
  },
  account: {
    path: () => ROUTES.ACCOUNT,
    url: () => `/${ROUTES.ACCOUNT}`,
  }
};
