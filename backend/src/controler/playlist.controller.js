import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErros.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlists.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    throw new ApiError(400, "please provide the data fields");
  }

  if ([name, description].some((field) => field.trim() == "")) {
    throw new ApiError(400, "please provide the valid data fields");
  }

  const user = req.user;

  if (!user) {
    throw new ApiError(403, "please login to create the playlist");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "please provide the valid userId");
  }

  if (!req.user) {
    throw new ApiError(401, "please login to see the playlist");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const playlist = await Playlist.find({ owner: userId }).populate("owner");

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "data fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, "please provide the valid playlist id");
  }

  const playlist = await Playlist.findById(playlistId)
    .populate("owner", "-password -refreshToken")
    .populate({
      path: "videos",
      populate: {
        path: "owner",
        select: "-password -refreshToken", // Exclude sensitive fields
      },
    });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId) {
    throw new ApiError(400, "please provide the playlistId");
  }

  if (!videoId) {
    throw new ApiError(400, "please provide the videoId");
  }

  const videoExist = await Video.findById(videoId);

  if (!videoExist) {
    throw new ApiError(404, "video does not exist");
  }
  const playlistExist = await Playlist.findById(playlistId);

  if (!playlistExist) {
    throw new ApiError(404, "playlist does not exist");
  }

  if (playlistExist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  const addedVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  )
    .populate("owner")
    .populate("videos");

  return res
    .status(200)
    .json(new ApiResponse(200, addedVideo, "video added successfully"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  if (!playlistId) {
    throw new ApiError(400, "please provide the playlistId");
  }

  if (!videoId) {
    throw new ApiError(400, "please provide the videoId");
  }

  const videoExist = await Video.findById(videoId);

  if (!videoExist) {
    throw new ApiError(404, "Video does not exist");
  }
  const playlistExist = await Playlist.findById(playlistId);

  if (!playlistExist) {
    throw new ApiError(404, "Playlist does not exist");
  }

  if (playlistExist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  if (!playlistExist.videos.includes(videoId)) {
    throw new ApiError(400, "Video is not in the playlist");
  }

  const deleteFields = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  )
    .populate("owner")
    .populate("videos");

  return res
    .status(200)
    .json(new ApiResponse(200, deleteFields, "Video removed successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist

  if (!playlistId) {
    throw new ApiError(400, "please provide the id of the playlist");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "playlist does not exsist");
  }

  if (!req.user) {
    throw new ApiError(401, "login first to do any changes");
  }

  if (req.user._id.toString() !== playlist.owner.toString()) {
    throw new ApiError(403, "you dont have access to modefy this playlist");
  }

  const deleted = await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, deleted, "Playlist remove successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if (!playlistId) {
    throw new ApiError(400, "please provide the playlist id");
  }

  if (!name || !description) {
    throw new ApiError(400, "please provide the data fields");
  }

  const playlistExist = await Playlist.findById(playlistId);

  if (!playlistExist) {
    throw new ApiError(404, "Play list does not exist");
  }

  if ([name, description].some((field) => field.trim() == "")) {
    throw new ApiError(400, "please provide the valid data fields");
  }

  const user = req.user;

  if (!user) {
    throw new ApiError(403, "please login to create the playlist");
  }

  if (playlistExist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to modify this playlist");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "playlist updated successfully")
    );
});

const getOwnersPlaylist = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "please logIn");
  }

  const playlist = await Playlist.find({ owner: user?._id })
    .populate("owner", "-password -refreshToken")
    .populate("videos");

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "users playlist fetch successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
  getOwnersPlaylist,
};
