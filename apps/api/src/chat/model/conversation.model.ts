export type MessageDbModel = {
  id: number;
  content: string;
  created_at: string;
  sender: {
    name: string;
    id: number;
    profile_photo_url: string | null;
  };
  conversation: {
    id: number;
    name: string;
    avatar_url: string;
    chat_type: string;
  };
};
