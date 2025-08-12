import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  getAllVideoOfUser,
  getChannelVideo,
  increaseViews
} from "../controler/video.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/Multer.middleware.js";

const router = Router();
router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

  router.route("/incView").post(increaseViews);

  router.route("/allVideos").get(getAllVideoOfUser)

  router.route("/channel/:channelId").get(getChannelVideo)

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);



router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
