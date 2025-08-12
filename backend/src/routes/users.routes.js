import {
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  logInUser,
  logOut,
  refreshAccessToken,
  registerUser,
  resetPassword,
  updateAvatar,
  updateCoverImage,
  updateUserDetail,
} from "../controler/user.controller.js";
import { Router } from "express";
import { upload } from "../middleware/Multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(logInUser);

router.route("/logout").post(verifyJwt, logOut);

router.route("/refresh-tokens").post(refreshAccessToken);

router.route("/reset-pass").post(verifyJwt, resetPassword);

router.route("/getUser").post(verifyJwt, getCurrentUser);

router.route("/updDetail").patch(verifyJwt, updateUserDetail);

router
  .route("/updAvatar")
  .patch(verifyJwt, upload.single("avatar"), updateAvatar);

router
  .route("/updCoverImage")
  .patch(upload.single("covarimage"), verifyJwt, updateCoverImage);

router.route("/channel/:userId").get(verifyJwt, getUserChannelProfile);

router.route("/watch-history").get(verifyJwt, getWatchHistory);

export default router;
