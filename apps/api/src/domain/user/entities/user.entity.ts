import { Email } from "../value-objects/email";
import { UserId } from "../value-objects/user-id";

export class User {
  constructor(
    private readonly id: UserId,
    private readonly name: string,
    private readonly email: Email,
    private readonly profilePhotoUrl?: string,
  ) {}

  getId(): string {
    return this.id.getValue();
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email.getValue();
  }

  getProfilePhotoUrl(): string | undefined {
    return this.profilePhotoUrl;
  }
}