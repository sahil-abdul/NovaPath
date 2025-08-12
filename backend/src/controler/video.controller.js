import mongoose, { isValidObjectId, pluralize } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErros.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { fileUpload } from "../utils/Cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;
  //TODO: get all videos based on query, sort, pagination
  // console.log(userId);
  const pipeline = [];

  // for using Full Text based search u need to create a search index in mongoDB atlas
  // you can include field mapppings in search index eg.title, description, as well
  // Field mappings specify which fields within your documents should be indexed for text search.
  // this helps in seraching only in title, desc providing faster search results
  // here the name of search index is 'search-videos'
  if (query) {
    pipeline.push({
      $search: {
        index: "search-videos",
        text: {
          query: query,
          path: ["title", "description"], //search only on title, desc
        },
      },
    });
  }

  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid userId");
    }

    pipeline.push({
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    });
  }

  // fetch videos only that are set isPublished as true
  pipeline.push({ $match: { isPublished: true } });

  //sortBy can be views, createdAt, duration
  //sortType can be ascending(-1) or descending(1)
  if (sortBy && sortType) {
    pipeline.push({
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  pipeline.push(
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$ownerDetails",
    }
  );

  const videoAggregate = Video.aggregate(pipeline);

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const video = await Video.aggregatePaginate(videoAggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!(title && description)) {
    throw new ApiError(400, "title and vedio description is required");
  }

  if ([title, description].some((feild) => feild.trim() == "")) {
    throw new ApiError(400, "please provide all feilds");
  }

  const vedioLocalPath = req.files?.videoFile[0].path;
  const thumbnailLocalPath = req.files?.thumbnail[0].path;

  if (!vedioLocalPath) {
    throw new ApiError(401, "please upload the videoFile");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(401, "please upload the thumbnail");
  }

  const videoFile = await fileUpload(vedioLocalPath);
  const thumbnail = await fileUpload(thumbnailLocalPath);

  if (!videoFile) {
    throw new ApiError(401, "please upload the videoFile");
  }

  if (!thumbnail) {
    throw new ApiError(401, "please upload the thumbnail");
  }

  // console.log(videoFile);

  const video = await Video.create({
    videoFile: videoFile?.url,
    thumbnail: thumbnail?.url,
    description,
    owner: req.user?._id,
    title,
    duration: videoFile?.duration,
    isPublished: true,
  });

  const uploadedVideo = await Video.findById(video?._id)
    .populate("owner")
    .select("-password -refreshToken");

  if (!uploadedVideo) {
    throw new ApiError(500, "something went wrong during uploding the video");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, uploadedVideo, "videop uploaded successfuly"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "please provide the video id");
  }

  const video = await Video.findById(videoId)
    .populate("owner")
    .select("-password -refreshToken");

  if (!video) {
    throw new ApiError(404, "the id is not valid or video is deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetch successfully"));

  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const user = req.user;

  if (!(title && description)) {
    throw new ApiError(400, "please provide the title and description");
  }

  if (!user) {
    throw new ApiError(403, "please login to upadete the video");
  }

  if (!videoId) {
    throw new ApiError(400, "please provide the video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "the video is not found");
  }

  if (String(user._id) !== String(video.owner)) {
    throw new ApiError(
      403,
      "you are not owner of the video you cant upadte it"
    );
  }

  const thumbnailLocalPath = await req.file?.path;

  const thumbnail = await fileUpload(thumbnailLocalPath);
  // console.log(thumbnailLocalPath);

  const upadate = await Video.findByIdAndUpdate(
    video._id,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail?.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, upadate, "video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const user = req.user;

  if (!videoId) {
    throw new ApiError(400, "please provide the vedio id");
  }

  if (!user) {
    throw new ApiError(401, "please login to change anything");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video not found");
  }

  if (String(user?._id) !== String(video?.owner)) {
    throw new ApiError(
      403,
      "you are not owner of the video you can't delete it"
    );
  }

  const deleted = await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, deleted, "video deleted succeessfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const user = req.user;

  if (!videoId) {
    throw new ApiError(400, "please provide the video id");
  }

  if (!user) {
    throw new ApiError(401, "please login to change anything");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video not found");
  }

  if (String(user?._id) !== String(video?.owner)) {
    throw new ApiError(
      403,
      "you are not owner of the video you can't toggle it"
    );
  }

  const updated = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video.isPublished,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Publish status toggled successfully"));
});

const getAllVideoOfUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "please logIn");
  }

  const videos = await Video.find({ owner: user?._id }).populate(
    "owner",
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "video fetch successfully"));
});

const getChannelVideo = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "please  provide channelId");
  }

  const isChannelExist = await User.findById(channelId);

  if (!isChannelExist) {
    throw new ApiError(404, "channel does not exsit");
  }

  const videos = await Video.find({ owner: channelId }).populate(
    "owner",
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "video fetch successfully"));
});

const increaseViews = asyncHandler(async (req, res) => {
  const { videoId } = req.body;

  if (!videoId) {
    throw new ApiError(400, "please provide the video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video not found");
  }



  video.views += 1;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "view added successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllVideoOfUser,
  getChannelVideo,
  increaseViews
};
