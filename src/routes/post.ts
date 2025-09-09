//External Imports.
import express from "express";

//Internal Imports
import { PostController } from "../controllers/PostController";
import { verifyToken } from "../middlewares/common/verifyToken";
import postUpload from "../middlewares/post/postUpload";
import {
  postCreateValidators,
  postUpdateValidators,
  postValidationHandler,
} from "../middlewares/post/postValidators";

//Initiate Routes
const router = express.Router();
router.get("/", PostController.getAll);
router.post(
  "/",
  verifyToken,
  postUpload,
  postCreateValidators,
  postValidationHandler,
  PostController.create
);
router.put(
  "/:id",
  verifyToken,
  postUpload,
  postUpdateValidators,
  postValidationHandler,
  PostController.update
);
router.delete("/:id", verifyToken, PostController.delete);
router.post("/:id/like", verifyToken, PostController.like);
router.delete("/:id/like", verifyToken, PostController.unlike);
router.get("/:id/comments", PostController.comments);
export default router;
