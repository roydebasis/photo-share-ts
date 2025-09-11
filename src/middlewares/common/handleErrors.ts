import { NextFunction, Request, Response } from "express";
import { APP_CONFIG } from "../../config/appConfig";
import { APPLICATON_MESSAGES } from "../../config/constants";
import { ErrorResponse } from "../../interfaces/ResponseTypes";
import { AppError } from "../../utilities/AppError";
import { ValidationError } from "../../utilities/ValidationError";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};

const sendErrorDev = (err: AppError, res: Response) => {
  const errorResponse: ErrorResponse = {
    status: err.status,
    error: {
      code: err.statusCode.toString(),
      message: err.message,
      details: err.stack,
    },
  };
  res.status(err.statusCode).json(errorResponse);
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational) {
    const errorResponse: ErrorResponse = {
      status: err.status,
      error: {
        code: err.statusCode.toString(),
        message: err.message,
      },
    };
    res.status(err.statusCode).json(errorResponse);
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      error: {
        code: "500",
        message: APPLICATON_MESSAGES.INTERNAL_ERROR,
      },
    });
  }
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    // This is a validation error. Format the response specifically.
    const errorResponse: ErrorResponse = {
      status: "fail", // Validation errors are client-side issues
      error: {
        code: "400",
        message: err.message,
        details: err.details,
      },
    };
    return res.status(err.statusCode).json(errorResponse);
  }

  // Handle all other errors using the existing logic
  const error = err instanceof AppError ? err : new AppError(err.message, 500);

  if (APP_CONFIG.nodeEnv !== "production") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};
