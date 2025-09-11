import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { APP_CONFIG } from "../../config/appConfig";
import { APPLICATON_MESSAGES } from "../../config/constants";
import { IJWTPayload } from "../../interfaces/AuthInterface";
import { AppError } from "../../utilities/AppError";
import { sendError } from "../../utilities/responseHelpers";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /**
     * Get the token from the request headers.The format is typically "Bearer TOKEN"
     * */
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      return sendError(
        res,
        new AppError(APPLICATON_MESSAGES.INVALID_TOKEN, 403)
      );
    }

    // Verify the token using the secret key
    jwt.verify(token, APP_CONFIG.jwt.secret, (err, decoded) => {
      if (err) {
        // If the token is invalid or expired, return 403 Forbidden
        return sendError(
          res,
          new AppError(APPLICATON_MESSAGES.INVALID_TOKEN, 403)
        );
      }
      // The decoded payload contains the user's information
      req.loggedInUser = decoded as IJWTPayload;
      next(); // Proceed to the next middleware or route handler
    });
  } catch (err) {
    next(err);
  }
};
