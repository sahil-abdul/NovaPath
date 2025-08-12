import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErros.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/likes.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comments.model.js";
import { Tweet } from "../models/tweets.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!videoId) {
    throw new ApiError(400, "please provide the video id");
  }

  if (!req.user) {
    throw new ApiError(401, "please login to like a video");
  }

  const videoExist = await Video.findById(videoId);

  if (!videoExist) {
    throw new ApiError(404, "video does not exist");
  }

  const document = await Like.findOne({
    $and: [{ video: videoId }, { likedBy: req.user._id }],
  });

  // dislike the video
  if (document) {
    const data = await Like.findByIdAndUpdate(
      document._id,
      {
        $set: {
          video: null,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(new ApiResponse(200, data, "Like removed"));
  }

  //liking the video
  const unLikeDocument = await Like.findOne({
    $and: [{ video: null }, { likedBy: req.user._id }],
  });

  if (unLikeDocument) {
    const data = await Like.findByIdAndUpdate(
      unLikeDocument._id,
      {
        $set: {
          video: videoId,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(new ApiResponse(200, data, "Like added"));
  } else {
    const newDocument = await Like.create({
      comment: null,
      video: videoId,
      likedBy: req.user._id,
      tweet: null,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newDocument, "like added"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "please provide the comment id");
  }

  if (!req.user) {
    throw new ApiError(401, "please login to like a comment");
  }

  const commentExist = await Comment.findById(commentId);

  if (!commentExist) {
    throw new ApiError(404, "comment does not exist");
  }

  const document = await Like.findOne({
    $and: [{ comment: commentId }, { likedBy: req.user._id }],
  });

  // dislike the comment
  if (document) {
    const data = await Like.findByIdAndUpdate(
      document._id,
      {
        $set: {
          comment: null,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(new ApiResponse(200, data, "Like removed"));
  }

  //liking the comment
  const unLikeDocument = await Like.findOne({
    comment: null,
    likedBy: req.user._id,
  });

  if (unLikeDocument) {
    const data = await Like.findByIdAndUpdate(
      unLikeDocument._id,
      {
        $set: {
          comment: commentId,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Like added(reuse)"));
  } else {
    const newDocument = await Like.create({
      comment: commentId,
      video: null,
      likedBy: req.user._id,
      tweet: null,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newDocument, "like added (new)"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!tweetId) {
    throw new ApiError(400, "please provide the tweetId");
  }

  if (!req.user) {
    throw new ApiError(401, "please login to like a tweet");
  }

  const tweetExist = await Tweet.findById(tweetId);

  if (!tweetExist) {
    throw new ApiError(404, "tweet does not exist");
  }

  const document = await Like.findOne({
    $and: [{ tweet: tweetId }, { likedBy: req.user._id }],
  });

  // dislike the tweet
  if (document) {
    const data = await Like.findByIdAndUpdate(
      document._id,
      {
        $set: {
          tweet: null,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(new ApiResponse(200, data, "Like removed"));
  }

  //liking the tweet
  const unLikeDocument = await Like.findOne({
    tweet: null,
    likedBy: req.user._id,
  });

  if (unLikeDocument) {
    const data = await Like.findByIdAndUpdate(
      unLikeDocument._id,
      {
        $set: {
          tweet: tweetId,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Like added(reuse)"));
  } else {
    const newDocument = await Like.create({
      comment: null,
      video: null,
      likedBy: req.user._id,
      tweet: tweetId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newDocument, "like added (new)"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "please login to de any oparation");
  }

  const likedVideos = await Like.find({ likedBy: user._id }).populate("video");

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "videos fetched successfully"));
});

const getVideoLikes = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "please provide the video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video deos not exit");
  }

  const allLikes = await Like.find({ video: videoId });

  return res
    .status(200)
    .json(new ApiResponse(200, allLikes, "provided all video likes"));
});

const getCommetLikes = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "please provide the comment id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment deos not exit");
  }

  const allLikes = await Like.find({ comment: commentId });

  return res
    .status(200)
    .json(new ApiResponse(200, allLikes, "provided all comment likes"));
});

const getTweetLikes = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "please provide the tweet id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "tweet deos not exit");
  }

  const allLikes = await Like.find({ tweet: tweetId });

  return res
    .status(200)
    .json(new ApiResponse(200, allLikes, "provided all tweet likes"));
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  getVideoLikes,
  getCommetLikes,
  getTweetLikes,
};
