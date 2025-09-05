import { NextFunction, Request, Response } from "express";
import fs from "fs";
import createError from "http-errors";
import path from "path";

//Internal imports
import { APP_CONFIG } from "../config/appConfiguration";
import { CustomAppRequest } from "../interfaces/Auth.Interface";
import { SafeUserProfile } from "../interfaces/User.Interface";
import { addEmailJob } from "../queues/emailQueue";
import { reportQueue } from "../queues/reportQueue";
import { MailOptions } from "../services/mailerService";
import {
  findUser,
  getFollowers as followersByUser,
  getFollowing as followingByUser,
  followUser,
  getAllUsers,
  isFollowing,
  unFollowUser,
  updateUser,
} from "../services/userService";
import { toSafeUserProfile } from "../transformers/userTransformer";
import { prepareRouteParams, sanitizeUpdate } from "../utilities/general";
import {
  errorResponse,
  getErrorCode,
  successResponse,
} from "../utilities/responseHandlerHelper";

async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sort = "id",
      order = "asc",
    } = req.query as Record<string, string>;

    const result = await getAllUsers(
      Number(page),
      Number(limit),
      search,
      sort,
      order
    );
    res.status(200).json(successResponse(result));
  } catch (err) {
    res.status(getErrorCode(err)).json(errorResponse(err));
  }
}

async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await findUser({ id: req.params.id });
    const safeProfile: SafeUserProfile = toSafeUserProfile(result);
    res.status(200).json(successResponse(safeProfile));
  } catch (err) {
    res.status(getErrorCode(err)).json(errorResponse(err));
  }
}

async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await findUser({ id: req.params.id });
    if (!user) {
      throw createError("User not found.");
    }
    const data = req.body;
    if (
      req.files &&
      Array.isArray(req.files) &&
      req.files.length &&
      user.avatar
    ) {
      //delete old avatar
      const oldAvatar = path.join(
        __dirname,
        `../public/uploads/avatars/${user.avatar}`
      );
      if (fs.existsSync(oldAvatar)) {
        fs.unlinkSync(oldAvatar);
      }
      data.avatar = req.files[0].filename;
    }
    const sanitizedData = sanitizeUpdate(data, ["password", "role"]);
    const result = await updateUser({ id: req.params.id }, sanitizedData);
    res
      .status(200)
      .json(successResponse(result, "Resource updated successfully."));
  } catch (err) {
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const { filename } = req.files[0];
      const uploadedAvatar = path.join(
        __dirname,
        `../public/uploads/avatars/${filename}`
      );
      if (fs.existsSync(uploadedAvatar)) {
        fs.unlinkSync(uploadedAvatar);
      }
    }
    res.status(getErrorCode(err)).json(errorResponse(err));
  }
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).json(successResponse(null, "Deleted successfully."));
  } catch (err) {
    res.status(getErrorCode(err)).json(errorResponse(err));
  }
}

async function follow(
  req: CustomAppRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const followerId = Number(req.loggedInUser?.id ?? 0);
    const followeeId = Number(req.params.id ?? 0);
    if (followerId === followeeId) {
      throw createError("You cannot follow yourself.");
    }
    const isExists = await isFollowing(followerId, followeeId);
    if (isExists) {
      throw createError("Already following this user.");
    }
    await followUser(followerId, followeeId);
    res.status(200).json(successResponse(null, "Followed successfully."));
  } catch (err) {
    res.status(getErrorCode(err)).json(errorResponse(err));
  }
}

async function unfollow(
  req: CustomAppRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await unFollowUser(
      Number(req.loggedInUser?.id),
      Number(req.params.id)
    );

    if (!result) {
      throw createError("Not following this user.");
    }
    res.status(200).json(successResponse(null, "Unfollowed successfully."));
  } catch (err) {
    res.status(getErrorCode(err)).json(errorResponse(err));
  }
}
/**
 * Get list of users following a user.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getFollowers(
  req: CustomAppRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const followerId = Number(req.loggedInUser?.id ?? 0);
    const followeeId = Number(req.params.id ?? 0);
    if (followerId !== followeeId) {
      throw createError("You canno see other users followers.");
    }
    const queryParams = prepareRouteParams(req.query);
    const result = await followersByUser(req.params.id, queryParams);
    res
      .status(200)
      .json(successResponse(result, "Resource retrieved successfully."));
  } catch (err) {
    res.status(getErrorCode(err)).json(errorResponse(err));
  }
}
/**
 * Get list of users that a user follows.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getFollowing(
  req: CustomAppRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const followerId = Number(req.loggedInUser?.id ?? 0);
    const followeeId = Number(req.params.id ?? 0);
    if (followerId !== followeeId) {
      throw createError("You cannot see who other users following.");
    }
    const queryParams = prepareRouteParams(req.query);
    const result = await followingByUser(req.params.id, queryParams);
    res
      .status(200)
      .json(successResponse(result, "Resource retrieved successfully."));
  } catch (err) {
    res.status(getErrorCode(err)).json(errorResponse(err));
  }
}
/**
 * TODO:: TEST ROUTES
 */
async function testWorkers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // await sendTestMail();
  await reportGenerated();
  res.json({
    message: "Jobs created...",
  });
}

async function sendTestMail() {
  const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Welcome to MyApp, Debashish!</h2>
          <p>We’re excited to have you on board 🎉</p>
          <p>Click below to verify your email:</p>
          <a href="https://myapp.com/verify?email=debashish@outlook.com}"
            style="background: #007bff; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p>If you did not create an account, please ignore this email.</p>
          <img src="cid:my-logo"/>
        </div>
      `;
  const mailOptions: MailOptions = {
    from: `"${APP_CONFIG.mailer.fromName}" <${APP_CONFIG.mailer.fromAddress}>`,
    to: ["team1@example.com", "team2@example.com"],
    cc: ["lead@example.com", "hr@example.com"],
    bcc: "roydebashish@outlook.com",
    subject: "⭐Queue⭐ Weekly Work Report.",
    html: htmlContent,
    attachments: [
      {
        filename: "avatar.png",
        path: "http://localhost:3000/images/nophoto.png",
        cid: "my-logo",
      },
    ],
  };
  //Priority can be high | normal | low.

  const mailInfo = await addEmailJob(mailOptions, {
    delay: 10000,
    attempts: 3,
    backoff: 5000,
  });
}

async function reportGenerated() {
  await reportQueue.add(
    "reportQueue",
    {
      title: "Weekly Work Report.",
      descripton: "some descripton",
    },
    {
      delay: 8000,
      attempts: 3,
      backoff: 5000,
    }
  );
}
/**
 * TODO:: End TEST ROUTES
 */

export {
  deleteUser,
  follow,
  getFollowers,
  getFollowing,
  getProfile,
  getUsers,
  testWorkers,
  unfollow,
  update,
};
