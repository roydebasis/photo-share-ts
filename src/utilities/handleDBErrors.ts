import { ValidationErrorDetail } from "../interfaces/ResponseTypes";
import { AppError } from "./AppError";
import { ValidationError } from "./ValidationError";

//TODO:: modify below errors as needed.
// This function translates specific database errors into our custom errors
export const handleDatabaseErrors = (err: any): AppError | ValidationError => {
  // Check for Mongoose Validation Errors (e.g., required field is missing)
  if (err.name === "ValidationError") {
    const details: ValidationErrorDetail[] = [];
    // Mongoose validation errors have a specific 'errors' property
    for (const key in err.errors) {
      if (err.errors.hasOwnProperty(key)) {
        details.push({
          field: err.errors[key].path,
          message: err.errors[key].message,
        });
      }
    }
    // Return a ValidationError with all the details
    return new ValidationError("Validation failed.", details);
  }

  // Check for Mongoose Duplicate Key Errors (MongoDB error code 11000)
  if (err.code === 11000) {
    // The error message contains the key that failed (e.g., 'email: "test@example.com"')
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate value: ${value}. Please use another value!`;
    // Return an AppError with a 409 Conflict status code
    return new AppError(message, 409);
  }

  // If we can't identify the error, return a generic 500 error
  return new AppError("Database operation failed.", 500);
};
