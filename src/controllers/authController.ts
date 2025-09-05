import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import createError from "http-errors";
import jwt, { SignOptions } from "jsonwebtoken";

//Internal imports
import { APP_CONFIG } from "../config/appConfiguration";
import { IJWTPayload, IUserRow } from "../interfaces/Auth.Interface";
import { SafeUserProfile } from "../interfaces/User.Interface";
import { createUser, findUser, updateUser } from "../services/userService";
import { toSafeUserProfile } from "../transformers/userTransformer";
import { avatarPath } from "../utilities/general";
import {
  errorResponse,
  getErrorCode,
  successResponse,
} from "../utilities/responseHandlerHelper";

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
    res.status(200).json(successResponse(safeProfile, "Sign-up successful."));
  } catch (err) {
    res.status(getErrorCode(err)).json(errorResponse(err));
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
      throw createError("Unknown user.");
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      throw createError("Invalid credentials.");
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

    res.status(200).json(successResponse(data, "Login successful."));
  } catch (err) {
    res.status(getErrorCode(err)).json(errorResponse(err));
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
      throw createError("Unknown user.");
    }

    const isValidPassword = await bcrypt.compare(
      req.body.current_password,
      user.password
    );
    if (!isValidPassword) {
      throw createError("Password does not match.");
    }

    const isSameAsOld = await bcrypt.compare(
      req.body.new_password,
      user.password
    );
    if (isSameAsOld) {
      throw createError(
        "You have entered the same password as the old password."
      );
    }

    const hashedPassword = await bcrypt.hash(
      req.body.new_password,
      APP_CONFIG.saltRounds
    );
    await updateUser({ id: req.params.id }, { password: hashedPassword });
    res.status(200).json(successResponse(null, "Password reset successful."));
  } catch (err) {
    res.status(getErrorCode(err)).json(errorResponse(err));
  }
};
