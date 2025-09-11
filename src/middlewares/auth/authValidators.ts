// external imports
import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { unlink } from "fs";
import path from "path";
import { APPLICATON_MESSAGES } from "../../config/constants";
import { findUser } from "../../services/UserService";
import { validatorMappedErrors } from "../../utilities/general";
import { ValidationError } from "../../utilities/ValidationError";

// Vallidate user data
const createUserValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet.")
    .trim(),
  check("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be 3-20 characters long")
    .matches(/^(?!.*--)(?!.*__)(?![-_])[a-zA-Z0-9_-]+(?<![-_])$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, hyphens, cannot start/end with hyphen/underscore or have consecutive hyphens/underscores"
    )
    .custom(async (value) => {
      try {
        const user = await findUser({ username: value });
        if (user) {
          throw new Error("Username already in use!");
        }
      } catch (err: any) {
        throw Error(err.message);
      }
    }),
  check("email")
    .isEmail()
    .withMessage("Invalid email address.")
    .trim()
    .custom(async (value) => {
      try {
        const user = await findUser({ email: value });
        if (user) {
          throw Error("Email already in use!");
        }
      } catch (err: any) {
        throw Error(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Mobile number must be a valid Bangladeshi mobile number")
    .custom(async (value) => {
      try {
        const user = await findUser({ mobile: value });
        if (user) {
          throw Error("Mobile already in use!");
        }
      } catch (err: any) {
        throw Error(err.message);
      }
    }),
  check("gender").optional().isAlpha(),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must contain 8+ chars: a-z, A-Z, 0-9, and special character."
    ),
];

const createUserValidationHandler = function (
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
      path.join(__dirname, `/../../public/uploads/avatars/${filename}`),
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
// Vallidate user data
const resetPasswordValidators = [
  check("current_password")
    .isStrongPassword()
    .withMessage(
      "Password must contain 8+ chars: a-z, A-Z, 0-9, and special character."
    ),
  check("new_password")
    .isStrongPassword()
    .withMessage(
      "Password must contain 8+ chars: a-z, A-Z, 0-9, and special character."
    ),
];

const resetPasswordValidatorHandler = function (
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
  throw new ValidationError(
    APPLICATON_MESSAGES.VALIDATION_ERROR,
    validatorMappedErrors(mappedErrors)
  );
};

export {
  createUserValidationHandler,
  createUserValidators,
  resetPasswordValidatorHandler,
  resetPasswordValidators,
};
