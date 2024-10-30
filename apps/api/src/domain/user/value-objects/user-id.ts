export class UserId {
  constructor(private readonly value: string) {
    this.validate(value);
  }

  private validate(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error("User ID cannot be empty");
    }
    // TODO: Add UUID validation if needed.
  }

  public getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
