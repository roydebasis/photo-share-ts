import { NextFunction, Request, Response } from "express";
import {
  ALLOWED_POST_MEDIA_TYPES,
  POST_MAX_IMAGE_SIZE,
} from "../../config/constants";
import uploader from "../../utilities/singleUploader";
import { AppError } from "../../utilities/AppError";

export default function postUpload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const upload = uploader(
    "posts",
    ALLOWED_POST_MEDIA_TYPES,
    POST_MAX_IMAGE_SIZE,
    `Only ${ALLOWED_POST_MEDIA_TYPES.join(", ")} allowed!`
  );

  // call the middleware function
  upload.any()(req, res, (err: any) => {
    if (err) {
      // res.status(500).json({
      //   errors: {
      //     files: {
      //       msg: err.message,
      //     },
      //   },
      // });
      throw new AppError(err.message, 500);
    } else {
      next();
    }
  });
}
