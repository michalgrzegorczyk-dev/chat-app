export enum MessageStatusType {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  FAILED = "FAILED",
}

export class MessageStatus {
  private readonly value: MessageStatusType;

  constructor(value: MessageStatusType) {
    this.validateStatus(value);
    this.value = value;
  }

  private validateStatus(value: MessageStatusType): void {
    if (!Object.values(MessageStatusType).includes(value)) {
      throw new Error("Invalid message status");
    }
  }

  public getValue(): MessageStatusType {
    return this.value;
  }

  public equals(other: MessageStatus): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public static create(value: string): MessageStatus {
    return new MessageStatus(value as MessageStatusType);
  }
}
