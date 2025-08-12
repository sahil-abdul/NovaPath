import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getOwnersTweets,
  getUserTweets,
  updateTweet,
} from "../controler/Tweet.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJwt);

router.route("/").get(getAllTweets).post(createTweet);

router.route("/owner").get(getOwnersTweets)

router.route("/user/:userId").get(getUserTweets);

router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;
