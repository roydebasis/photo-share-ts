//External Imports
import express from "express";

//Internal Imports
import {register, login, resetPassword} from '../controllers/authController';
import {
    createUserValidators,
    createUserValidationHandler,
    resetPasswordValidators,
    resetPasswordValidatorHandler
} from '../middlewares/auth/authValidators';
import {doLoginValidators, doLoginValidatorHandler} from '../middlewares/auth/loginValidators';
import avatarUploader from '../middlewares/auth/avatarUpload';

//Initiate Routes
const router = express.Router();
router.post('/register', avatarUploader, createUserValidators, createUserValidationHandler, register);
router.post('/login', doLoginValidators, doLoginValidatorHandler, login);
router.patch('/reset-password/:id', resetPasswordValidators, resetPasswordValidatorHandler, resetPassword);

export default router;