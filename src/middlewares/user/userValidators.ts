// external imports
import { check, validationResult } from "express-validator";
import createError from "http-errors";
import path from "path";
import { unlink } from "fs";
import { Request, Response, NextFunction } from "express";
import { deleteFile } from "../../utilities/general";

// internal imports
const { findUser } = require("../../services/userService");

// Vallidate user data
const createUpdateValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet.")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address.")
    .trim()
    .custom(async (value, { req }) => {
      try {
        const user = await findUser({ email: value }, req.params?.id);
        if (user) {
          throw createError("Email already is use!");
        }
      } catch (err: any) {
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Mobile number must be a valid Bangladeshi mobile number")
    .custom(async (value, { req }) => {
      try {
        const user = await findUser({ mobile: value }, req.params?.id);
        if (user) {
          throw createError("Mobile already is use!");
        }
      } catch (err: any) {
        throw createError(err.message);
      }
    }),
  check("gender")
    .optional()
    .isAlpha()
    .withMessage("Only alphabets are allowed."),
];

const updateValidationHandler = function (
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
    deleteFile(filename, "avatars");
  }

  res.status(400).json({
    errors: mappedErrors,
  });
};

export { createUpdateValidators, updateValidationHandler };
