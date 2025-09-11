//External Imports
import express from "express";

//Internal Imports
import { login, register, resetPassword } from "../controllers/AuthController";
import {
  createUserValidationHandler,
  createUserValidators,
  resetPasswordValidatorHandler,
  resetPasswordValidators,
} from "../middlewares/auth/authValidators";
import avatarUploader from "../middlewares/auth/avatarUpload";
import {
  doLoginValidatorHandler,
  doLoginValidators,
} from "../middlewares/auth/loginValidators";

//Initiate Routes
const router = express.Router();
router.post(
  "/register",
  avatarUploader,
  createUserValidators,
  createUserValidationHandler,
  register
);
router.post("/login", doLoginValidators, doLoginValidatorHandler, login);
router.patch(
  "/reset-password/:id",
  resetPasswordValidators,
  resetPasswordValidatorHandler,
  resetPassword
);

export default router;
