import { IJWTPayload } from "../interfaces/AuthInterface";

declare global {
  namespace Express {
    interface Request {
      loggedInUser?: IJWTPayload;
    }
  }
}
