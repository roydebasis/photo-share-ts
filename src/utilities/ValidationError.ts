import { AppError } from "./AppError";
import { ValidationErrorDetail } from "../interfaces/ResponseTypes";

export class ValidationError extends AppError {
  public details: ValidationErrorDetail[];

  constructor(message: string, details: ValidationErrorDetail[]) {
    // 400 is the standard HTTP status code for "Bad Request" (validation errors)
    super(message, 400);
    this.name = "ValidationError";
    this.details = details;
    this.isOperational = true; // Validation errors are expected, so they are operational
  }
}
