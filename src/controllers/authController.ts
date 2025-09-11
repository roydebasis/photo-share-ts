import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import jwt, { SignOptions } from "jsonwebtoken";
import regEvent from "../events/NewAccountEvent";

//Internal imports
import { APP_CONFIG } from "../config/appConfig";
import { APPLICATON_MESSAGES } from "../config/constants";
import { IJWTPayload, IUserRow } from "../interfaces/AuthInterface";
import { SafeUserProfile } from "../interfaces/UserInterface";
import { createUser, findUser, updateUser } from "../services/UserService";
import { toSafeUserProfile } from "../transformers/userTransformer";
import { AppError } from "../utilities/AppError";
import { avatarPath } from "../utilities/general";
import { sendError, sendSuccess } from "../utilities/responseHelpers";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = matchedData(req);
    const data: IUserRow = {
      name: validatedData.name,
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password,
      role: "user",
      mobile: validatedData.mobile,
      gender: validatedData.gender,
      status: "active",
    };
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      data.avatar = req.files[0].filename;
    }
    const user = await createUser(data);
    const safeProfile: SafeUserProfile = toSafeUserProfile(user);
    regEvent.emit("accountOpened", safeProfile);
    sendSuccess<SafeUserProfile>(res, safeProfile);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<object | void> => {
  try {
    const user = await findUser({ email: req.body.username });
    if (!user) {
      // throw new AppError(APPLICATON_MESSAGES.NOT_FOUND, 404);
      return sendError(res, new AppError(APPLICATON_MESSAGES.NOT_FOUND, 404));
    }
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      // throw new AppError(APPLICATON_MESSAGES.INVALID_REQUEST, 401);
      return sendError(
        res,
        new AppError(APPLICATON_MESSAGES.INVALID_REQUEST, 401)
      );
    }

    //TODO:: move jwt token generation to a separate function
    const payload: IJWTPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const secret = APP_CONFIG.jwt.secret;
    const options = { expiresIn: APP_CONFIG.jwt.expiry } as SignOptions;
    const token = jwt.sign(payload, secret, options);
    const data = {
      token,
      ...payload,
      mobile: user.mobile,
      gender: user.gender || "",
      avatar: avatarPath(user.avatar),
    };

    sendSuccess<object>(res, data);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await findUser({ id: req.params.id });
    if (!user) {
      return sendError(res, new AppError(APPLICATON_MESSAGES.NOT_FOUND, 401));
    }

    const isValidPassword = await bcrypt.compare(
      req.body.current_password,
      user.password
    );
    if (!isValidPassword) {
      return sendError(
        res,
        new AppError(APPLICATON_MESSAGES.INVALID_REQUEST, 422)
      );
    }

    const isSameAsOld = await bcrypt.compare(
      req.body.new_password,
      user.password
    );
    if (isSameAsOld) {
      return sendError(
        res,
        new AppError(APPLICATON_MESSAGES.SAME_PASSWORD, 422)
      );
    }

    const hashedPassword = await bcrypt.hash(
      req.body.new_password,
      APP_CONFIG.saltRounds
    );
    await updateUser({ id: req.params.id }, { password: hashedPassword });
    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
};
