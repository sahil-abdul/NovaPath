import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  isSubscribe,
  toggleSubscription,
} from "../controler/subscriotion.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router
  .route("/c/:channelId")
  .get(getUserChannelSubscribers)
  .post(toggleSubscription)

  router.route("/isSub/:channelId")
  .get(isSubscribe);

router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router;
