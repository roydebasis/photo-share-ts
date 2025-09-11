export class AppError extends Error {
  public statusCode: number;
  public status: "fail" | "error";
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    /**
     * isOperational flag is used to distinguish two different type of errors:
     *  1. Operational Errors: Expected, predictable errors that are part of the normal functioning of a well-designed application.
     *  2. Programming Errors: Unexpected, unpredictable bugs or crashes that indicate a flaw in the code.
     * */
    this.isOperational = true;

    // This line is important for proper stack trace in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
