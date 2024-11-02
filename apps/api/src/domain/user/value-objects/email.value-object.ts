export class Email {
  constructor(private readonly value: string) {
    this.validate(value);
  }

  private validate(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error("Email cannot be empty");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  public getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}
