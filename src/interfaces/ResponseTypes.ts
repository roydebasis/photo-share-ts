interface SuccessResponse<T> {
  status: "success";
  data: T;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

interface ErrorDetails {
  code: string;
  message: string;
  details?: string | ValidationErrorDetail[] | any;
}

/**
 * error: reserved for server-side errors.
 *        It corresponds to HTTP status codes in the 5xx range (e.g., 500 Internal Server Error, 502 Bad Gateway).
 *        What it means: The API received a valid request, but it failed to process it due to an unexpected problem on the server.
 *        The issue is on the server's side, and the client cannot fix it.
 *        examples: A database connection failing.,
 *                  An uncaught exception in the code (e.g., trying to access a property on an undefined variable).
 *                   A third-party service that your server depends on is down.
 * fail: This status is reserved for client-side errors. It corresponds to HTTP status codes in the 4xx range (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found).
 *      What it means: The API understood the request, but the request itself contained a problem. The issue is on the client's side, and they are responsible for fixing it.
 *       Examples: Sending invalid data (e.g., an email address without a "@").
                  Trying to access a resource that doesn't exist (404 Not Found).
                  Failing to provide a valid authentication token (401 Unauthorized). 
                  Submitting data with missing required fields.
 */
export interface ErrorResponse {
  status: "fail" | "error";
  error: ErrorDetails;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
