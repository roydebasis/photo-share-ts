import { NextFunction, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { APPLICATON_MESSAGES } from "../../config/constants";
import { validatorMappedErrors } from "../../utilities/general";
import { ValidationError } from "../../utilities/ValidationError";

export const doLoginValidators = [
  check("username")
    .isLength({ min: 1 })
    .withMessage("Mobile number or email is required"),
  check("password").isLength({ min: 1 }).withMessage("Password is required"),
];

export const doLoginValidatorHandler = function (
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
