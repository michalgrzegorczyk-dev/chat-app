export class MessageContent {
  private readonly value: string;
  private static readonly MAX_LENGTH = 2000;

  constructor(value: string) {
    this.validateContent(value);
    this.value = value;
  }

  private validateContent(value: string): void {
    if (!value || typeof value !== "string") {
      throw new Error("Message content must be a non-empty string");
    }

    if (value.length > MessageContent.MAX_LENGTH) {
      throw new Error(`Message content cannot exceed ${MessageContent.MAX_LENGTH} characters`);
    }

    if (value.trim().length === 0) {
      throw new Error("Message content cannot be empty or only whitespace");
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: MessageContent): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
