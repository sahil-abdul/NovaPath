import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getOwnersPlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controler/playlist.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPlaylist).get(getOwnersPlaylist);

router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);

export default router;
