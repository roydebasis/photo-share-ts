import express from "express";

//Internal Imports
import { CommentController } from "../controllers/CommentController";
import {
  commentValidationHandler,
  commentValidators,
  commentUpdateValidationHandler,
  commentUpdateValidators,
} from "../middlewares/comment/commentValidators";
import { verifyToken } from "../middlewares/common/verifyToken";

//Initiate Routes
const router = express.Router();
// router.get("/", verifyToken, CommentController.getAll);
router.post(
  "/",
  verifyToken,
  commentValidators,
  commentValidationHandler,
  CommentController.create
);
router.put(
  "/:id",
  verifyToken,
  commentUpdateValidators,
  commentUpdateValidationHandler,
  CommentController.update
);
router.delete("/:id", verifyToken, CommentController.delete);
router.post("/:id/like", verifyToken, CommentController.like);
router.delete("/:id/like", verifyToken, CommentController.unlike);

export default router;
