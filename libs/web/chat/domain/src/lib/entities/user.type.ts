export interface User {
  id: string;
  avatarUrl: string;
  name?: string;
}

export type UserKeys = keyof User;
