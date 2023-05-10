// Using abstract class over interface because it carries over to JS (instanceof)
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // Response normalization strategy
  abstract serializeErrors(): { message: string; field?: string }[];
}
