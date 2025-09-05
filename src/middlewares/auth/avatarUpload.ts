import { NextFunction, Request, Response } from "express";
import {
  ALLOWED_IMAGE_TYPES,
  AVATAR_MAX_IMAGE_SIZE,
} from "../../config/constants";
import uploader from "../../utilities/singleUploader";

export default function avatarUpload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const upload = uploader(
    "avatars",
    ALLOWED_IMAGE_TYPES,
    AVATAR_MAX_IMAGE_SIZE,
    `Only ${ALLOWED_IMAGE_TYPES.join(",")} allowed!`
  );

  // call the middleware function
  upload.any()(req, res, (err: any) => {
    if (err) {
      res.status(500).json({
        errors: {
          avatar: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}
