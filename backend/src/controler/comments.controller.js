import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErros.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comments.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "please provide the video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video does not exist");
  }

  const userId = req.user?._id
    ? new mongoose.Types.ObjectId(req.user._id)
    : null;

  const pipeline = [
    { $match: { video: new mongoose.Types.ObjectId(videoId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          { $project: { username: 1, fullName: 1, avatar: 1, email: 1 } },
        ],
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likes" },
        isLiked: userId ? { $in: [userId, "$likes.likedBy"] } : false,
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        content: 1,
        createdAt: 1,
        likesCount: 1,
        owner: "$ownerDetails",
        isLiked: 1,
      },
    },
  ];

  // const commentAgrgate = await Comment.aggregate(pipeline);

  const aggregate = Comment.aggregate(pipeline);

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 }, // descending (newest first)
  };

  const comments = await Comment.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { content } = req.body;
  const { videoId } = req.params;

  if (!content) {
    throw new ApiError(400, "please provide the content of comment");
  }

  if (content.trim() === "") {
    throw new ApiError(400, "please provide the valid comment");
  }

  const user = req.user;

  if (!user) {
    throw new ApiError(401, "please login to do any comments");
  }

  if (!videoId) {
    throw new ApiError(400, "please provide the valid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video does not exist");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: user._id,
  });

  if (!comment) {
    throw new ApiError(500, "error occured during adding comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "please login to upadete comments");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Please provide a valid comment");
  }

  if (!commentId) {
    throw new ApiError(400, "please provide the commnet id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment does not exist");
  }

  if (comment.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "you can't update the comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "please login to upadete comments");
  }

  if (!commentId) {
    throw new ApiError(400, "please provide the commnet id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment does not exist");
  }

  if (comment.owner.toString() !== user._id.toString()) {
    throw new ApiError(403, "you can't delete the comment");
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
