import express from "express";

//Internal Imports
import { APP_CONFIG } from "../config/appConfiguration";
import authRoutes from "./auth";
import postRoutes from "./post";
import userRoutes from "./user";
import commentRoutes from "./comment";

//Initiate Routes
const router = express.Router();
router.use(`/${APP_CONFIG.apiPrefix}/auth`, authRoutes);
router.use(`/${APP_CONFIG.apiPrefix}/users`, userRoutes);
router.use(`/${APP_CONFIG.apiPrefix}/posts`, postRoutes);
router.use(`/${APP_CONFIG.apiPrefix}/comments`, commentRoutes);

export default router;
