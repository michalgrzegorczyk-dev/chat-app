export class AuthToken {
  constructor(
    private readonly accessToken: string,
    private readonly refreshToken: string,
    private readonly userId: string,
    private readonly userName: string,
    private readonly userEmail: string,
    private readonly userProfilePhotoUrl?: string,
  ) {}

  getAccessToken(): string {
    return this.accessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  getUserId(): string {
    return this.userId;
  }

  getUserName(): string {
    return this.userName;
  }

  getUserEmail(): string {
    return this.userEmail;
  }

  getUserProfilePhotoUrl(): string | undefined {
    return this.userProfilePhotoUrl;
  }
}
