export interface AuthResponseDto {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    profile_photo_url: string | null;
  };
}
