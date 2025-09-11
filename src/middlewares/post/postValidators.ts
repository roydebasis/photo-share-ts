import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { unlink } from "fs";
import path from "path";
import {
  ALLOWED_POST_MEDIA_TYPES,
  APPLICATON_MESSAGES,
  VISIBILITY_TYPES,
} from "../../config/constants";
import { ValidationError } from "../../utilities/ValidationError";
import { validatorMappedErrors } from "../../utilities/general";
// Vallidate post data
const postCreateValidators = [
  check("caption")
    .notEmpty()
    .withMessage("Caption is required")
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("Caption must be 3-500 characters long"),
  check("files").custom((value, { req }) => {
    console;
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new Error("File is required.");
    }

    // Validate file types and sizes
    const maxSize = 10 * 1024 * 1024; // 10MB
    for (const file of req.files) {
      // Check file type
      if (!ALLOWED_POST_MEDIA_TYPES.includes(file.mimetype)) {
        throw new Error(
          `File type ${
            file.mimetype
          } is not allowed. Allowed types: ${ALLOWED_POST_MEDIA_TYPES.join(
            ", "
          )}`
        );
      }
      // Check file size
      if (file.size > maxSize) {
        throw new Error(
          `File ${file.originalname} is too large. Maximum size is 10MB`
        );
      }
    }

    return true;
  }),
  check("visibility")
    .isAlpha()
    .custom((value, { req }) => {
      if (!VISIBILITY_TYPES.includes(value)) {
        throw new Error(
          "Visibility type is invalid. Should be one of: " +
            VISIBILITY_TYPES.join(",")
        );
      }

      return true;
    }),
];

// Vallidate update data
const postUpdateValidators = [
  check("caption")
    .notEmpty()
    .withMessage("Caption is required")
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("Caption must be 3-500 characters long"),
  check("files")
    .optional()
    .custom((value, { req }) => {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        throw new Error("File is required.");
      }
      // Validate file types and sizes
      const maxSize = 10 * 1024 * 1024; // 10MB
      for (const file of req.files) {
        // Check file type
        if (!ALLOWED_POST_MEDIA_TYPES.includes(file.mimetype)) {
          throw new Error(
            `File type ${
              file.mimetype
            } is not allowed. Allowed types: ${ALLOWED_POST_MEDIA_TYPES.join(
              ", "
            )}`
          );
        }
        // Check file size
        if (file.size > maxSize) {
          throw new Error(
            `File ${file.originalname} is too large. Maximum size is 10MB`
          );
        }
      }

      return true;
    }),
  check("visibility")
    .isAlpha()
    .custom((value, { req }) => {
      if (!VISIBILITY_TYPES.includes(value)) {
        throw new Error(
          "Visibility type is invalid. Should be one of: " +
            VISIBILITY_TYPES.join(",")
        );
      }

      return true;
    }),
];
// Validator handler
const postValidationHandler = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
    return;
  }

  // remove uploaded files
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const { filename } = req.files[0];
    unlink(
      path.join(__dirname, `/../../public/uploads/posts/${filename}`),
      (err) => {
        if (err) console.log(err);
      }
    );
  }

  throw new ValidationError(
    APPLICATON_MESSAGES.VALIDATION_ERROR,
    validatorMappedErrors(mappedErrors)
  );
};

export { postCreateValidators, postUpdateValidators, postValidationHandler };
