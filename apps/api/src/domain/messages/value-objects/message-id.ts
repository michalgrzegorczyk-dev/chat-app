export class MessageId {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error("MessageId cannot be empty");
    }
  }

  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }

  static generate(): MessageId {
    return new MessageId(crypto.randomUUID());
  }
}
