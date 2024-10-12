export const ROUTES = {
  AUTH: 'auth',
  CHAT: 'chat',
  USERS: 'users',
  ACCOUNT: 'account',
  CONVERSATIONS: 'conversations'
} as const;

export const ROUTE_PARAMS = {
  CONVERSATION_ID: 'conversationId',
  USER_ID: 'userId'
} as const;

const createUrl = (...segments: string[]) => `/${segments.join('/')}`;

export const routes = {
  auth: {
    path: ROUTES.AUTH,
    url: () => createUrl(ROUTES.AUTH)
  },
  chat: {
    path: ROUTES.CHAT,
    url: () => createUrl(ROUTES.CHAT),
    conversation: {
      path: `:${ROUTE_PARAMS.CONVERSATION_ID}`,
      content: {
        url: (id: string) => createUrl(ROUTES.CHAT, ROUTES.CONVERSATIONS, id)
      }
    },
    conversations: {
      url: () => createUrl(ROUTES.CHAT, ROUTES.CONVERSATIONS)
    },
    users: {
      url: () => createUrl(ROUTES.CHAT, ROUTES.USERS)
    }
  },
  account: {
    path: ROUTES.ACCOUNT,
    url: () => createUrl(ROUTES.ACCOUNT)
  }
};
