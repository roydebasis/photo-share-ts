export const HTTP_ERROR_MESSAGES = {
  INVALID_REQUEST: {
    errorCode: "INVALID_REQUEST",
    title: "invalid_request",
    message: "Invalid request",
    statusCode: 400,
  },
  FETCH_FAILED: {
    errorCode: "FETCH_FAILED",
    title: "fetch_failed",
    message: "Failed to fetch data",
    statusCode: 500,
  },
  CREATE_FAILED: {
    errorCode: "CREATE_FAILED",
    title: "create_failed",
    message: "Failed to create resource",
    statusCode: 500,
  },
  UPDATE_FAILED: {
    errorCode: "UPDATE_FAILED",
    title: "update_failed",
    message: "Failed to update resource",
    statusCode: 500,
  },
  DELETE_FAILED: {
    errorCode: "DELETE_FAILED",
    title: "delete_failed",
    message: "Failed to delete resource",
    statusCode: 500,
  },
  VALIDATION_ERROR: {
    errorCode: "VALIDATION_ERROR",
    title: "validation_error",
    message: "Validation error occurred",
    statusCode: 400,
  },
  VERIFICATION_FAILED: {
    errorCode: "VERIFICATION_FAILED",
    title: "verification_failed",
    message: "Verification failed",
    statusCode: 400,
  },
  UNAUTHORIZED: {
    errorCode: "UNAUTHORIZED",
    title: "unauthorized",
    message: "Unauthorized to perform this action.",
    statusCode: 401,
  },
  FORBIDDEN: {
    errorCode: "FORBIDDEN",
    title: "forbidden",
    message: "Access to this resource is forbidden.",
    statusCode: 403,
  },
  NOT_FOUND: {
    errorCode: "NOT_FOUND",
    title: "not_found",
    message: "Resource not found",
    statusCode: 404,
  },
  INTERNAL_ERROR: {
    errorCode: "INTERNAL_ERROR",
    title: "internal_error",
    message: "Internal server error",
    statusCode: 500,
  },
  ZOD_VALIDATION_ERROR: {
    errorCode: "ZOD_VALIDATION_ERROR",
    title: "validation_error",
    message: "Validation error occurred",
    statusCode: 400,
  },
  UNKNOWN_ERROR: {
    errorCode: "UNKNOWN_ERROR",
    title: "unknown_error",
    message: "An unexpected error occurred",
    statusCode: 500,
  },
  LOGIN_FAILED: {
    errorCode: "LOGIN_FAILED",
    title: "login_failed",
    message: "Login failed",
    statusCode: 401,
  },
  LOGOUT_FAILED: {
    errorCode: "LOGOUT_FAILED",
    title: "logout_failed",
    message: "Logout failed",
    statusCode: 401,
  },
  REFRESH_FAILED: {
    errorCode: "REFRESH_FAILED",
    title: "refresh_failed",
    message: "Refresh token failed",
    statusCode: 401,
  },
};

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const AVATAR_MAX_IMAGE_SIZE = 1000000; // 1mb
export const POST_MAX_IMAGE_SIZE = 10 * 1000000; //10MB
export const ALLOWED_FILE_TYPES = ["application/pdf"];

// Enhanced file types for posts (images, videos, gifs)
export const ALLOWED_POST_MEDIA_TYPES = [
  "image/jpeg", 
  "image/jpg", 
  "image/png", 
  "image/gif", 
  "image/webp",
  "video/mp4",
  "video/avi", 
  "video/mov",
  "video/wmv"
];
