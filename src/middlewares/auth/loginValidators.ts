import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";


export const doLoginValidators = [
  check("username")
    .isLength({ min: 1 })
    .withMessage("Mobile number or email is required"),
  check("password")
    .isLength({ min: 1 })
    .withMessage("Password is required")
];

export const doLoginValidatorHandler = function (req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
    return;
  }

  console.log(req.body);

  res.status(400).json({
        errors: mappedErrors,
  });
};