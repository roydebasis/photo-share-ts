// utils/response-helpers.ts

import { Response } from "express";
import { AppError } from "./AppError";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    status: "success",
    data,
  });
};

export const sendError = (res: Response, err: AppError) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: {
      code: err.statusCode.toString(),
      message: err.message,
    },
  });
};
