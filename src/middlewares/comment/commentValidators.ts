// external imports
import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { APPLICATON_MESSAGES } from "../../config/constants";
import { ValidationError } from "../../utilities/ValidationError";
import { validatorMappedErrors } from "../../utilities/general";

// Vallidate comment data
const commentValidators = [
  check("post_id")
    .notEmpty()
    .withMessage("Post id is required")
    .isNumeric()
    .withMessage("Only numbers are allowed.")
    .trim(),
  check("parent_id")
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
    .withMessage("Only numbers are allowed.")
    .trim(),
  check("comment")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Comment is required")
    .trim(),
];

const commentValidationHandler = function (
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

const commentUpdateValidators = [
  check("comment")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Comment is required")
    .trim(),
];

const commentUpdateValidationHandler = function (
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
  commentUpdateValidationHandler,
  commentUpdateValidators,
  commentValidationHandler,
  commentValidators,
};
