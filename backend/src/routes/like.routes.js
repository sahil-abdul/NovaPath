import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
  getVideoLikes,
  getCommetLikes,
  getTweetLikes,
} from "../controler/like.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/get/v/:videoId").get(getVideoLikes);
router.route("/get/c/:commentId").get(getCommetLikes);
router.route("/get/t/:tweetId").get(getTweetLikes);
router.route("/videos").get(getLikedVideos);

export default router;
