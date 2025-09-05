export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly error_cause: any;
  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    error?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.error_cause = error;
    Error.captureStackTrace(this, this.constructor);
  }
}
