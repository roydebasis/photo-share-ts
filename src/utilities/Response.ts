import { Response } from "express";
import { HTTP_ERROR_MESSAGES } from "../config/constants";
import { IErrorResponse, IHttpError } from "../interfaces/General.Inteface";
import { AppError } from "./AppError";
// import logger from "./logger";

export const ApiResponse = (
  res: Response,
  data: any,
  message: string = "Process completed.",
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    result_code: statusCode,
    date: new Date().valueOf(),
    status: "success",
    message,
    result: data,
  });
};

export const ApiErrorResponse = (
  res: Response,
  http_error: IHttpError,
  errorDetails?: any
) => {
  let error: IErrorResponse;
  const defaultMessage = http_error.message || "An unexpected error occurred";
  const statusCode = http_error.statusCode || 500;

  if (errorDetails) {
    if (errorDetails instanceof AppError) {
      // Log non-operational errors (unexpected system errors)
      if (!errorDetails.isOperational) {
        const resLog = {
          datetime: new Date().toString(),
          status_code: res.statusCode,
          clientIp: res.req.ip,
          userAgent: res.req.headers["user-agent"],
          error: errorDetails,
        };
        // logger.error(JSON.stringify(resLog));
      }
      error = {
        message: errorDetails.message || defaultMessage,
        isOperational: errorDetails?.isOperational,
      };
    } else if (
      http_error.errorCode ===
      HTTP_ERROR_MESSAGES.ZOD_VALIDATION_ERROR.errorCode
    ) {
      // Handle Zod validation errors
      error = errorDetails;
    } else if (typeof errorDetails === "string") {
      error = { message: errorDetails, isOperational: true };
    } else {
      error = { message: defaultMessage, isOperational: true };
    }
  } else {
    error = { message: defaultMessage, isOperational: true };
  }
  res.status(statusCode).json({
    result_code: statusCode,
    date: new Date().valueOf(),
    status: "error",
    title: http_error.title,
    error_info: http_error.message,
    error,
  });
};
