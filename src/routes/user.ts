const express = require("express");

//Internal Imports
import {
  follow,
  getFollowers as followers,
  getFollowing as following,
  getProfile,
  getUsers,
  unfollow,
  update,
} from "../controllers/userController";
import avatarUploader from "../middlewares/auth/avatarUpload";
import { verifyToken } from "../middlewares/common/verifyToken";
import {
  createUpdateValidators,
  updateValidationHandler,
} from "../middlewares/user/userValidators";

//Initiate Routes
const router = express.Router();
router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getProfile);
router.put(
  "/:id",
  verifyToken,
  avatarUploader,
  createUpdateValidators,
  updateValidationHandler,
  update
);
// router.delete('/:id', verifyToken, deleteUser);
router.get("/:id/followers", verifyToken, followers);
router.get("/:id/following", verifyToken, following);
router.post("/:id/follow", verifyToken, follow);
router.delete("/:id/unfollow", verifyToken, unfollow);

export default router;
