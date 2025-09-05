import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { APP_CONFIG } from "../../config/appConfiguration";
import { CustomAppRequest, IJWTPayload } from "../../interfaces/Auth.Interface";
import { errorResponse } from "../../utilities//responseHandlerHelper";

export const verifyToken = (
  req: CustomAppRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // token = cookies[process.env.COOKIE_NAME];
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    // next();

    // Get the token from the request headers
    // The format is typically "Bearer TOKEN"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return res
        .status(401)
        .json(errorResponse("", "Authentication failed. No token provided."));
    }

    // Verify the token using the secret key
    jwt.verify(token, APP_CONFIG.jwt.secret, (err, decoded) => {
      if (err) {
        // If the token is invalid or expired, return 403 Forbidden
        return res
          .status(403)
          .json(errorResponse("", "Invalid or expired token."));
      }
      // The decoded payload contains the user's information
      req.loggedInUser = decoded as IJWTPayload;
      next(); // Proceed to the next middleware or route handler
    });
  } catch (err) {
    res.status(500).json(errorResponse(err));
  }
};
