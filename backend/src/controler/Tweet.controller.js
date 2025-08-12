import { asyncHandler } from "../utils/asynchandler.js";
import { Tweet } from "../models/tweets.model.js";
import { ApiError } from "../utils/ApiErros.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "please provide the tweet content");
  }

  if (content.trim() == "") {
    throw new ApiError(400, "please provide the valid data");
  }

  const user = req.user;

  if (!user) {
    throw new ApiError(403, "please login for writing the tweet ");
  }

  const validUser = await User.findById(user?._id);

  if (!validUser) {
    throw new ApiError(403, "user not found! please relogin ");
  }

  const tweet = await Tweet.create({
    owner: validUser._id,
    content: content,
  });

  const tweetData = await Tweet.findById(tweet?._id)
    .populate("owner")
    .select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, tweetData, "new tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "please provide the userId");
  }

  if (!req.user) {
    throw new ApiError(401, "please login to see the all post of the user");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  // const data = await User.aggregate([
  //   {
  //     $match: {
  //       _id: new mongoose.Types.ObjectId(user?._id),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "tweets",
  //       localField: "_id",
  //       foreignField: "owner",
  //       as: "tweets",
  //     },
  //   },
  //   {
  //     $project: {
  //       username: 1,
  //       fullName: 1,
  //       tweets: 1,
  //     },
  //   },
  // ]);
  const data = await Tweet.find({ owner: user._id }).populate(
    "owner",
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, data, "all tweets fetch successsfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId) {
    throw new ApiError(400, "please provide the tweet id");
  }

  if (!content) {
    throw new ApiError(400, "please provide the content");
  }

  if (content.trim() == "") {
    throw new ApiError(400, "please provide the valid content");
  }

  if (!req.user) {
    throw new ApiError(400, "please login first");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "tweet not found");
  }

  if (String(req.user?._id) != String(tweet?.owner)) {
    throw new ApiError(
      403,
      "you are not the owner of thw tweet you can't update it"
    );
  }

  const update = await Tweet.findByIdAndUpdate(
    tweet._id,
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
    .json(new ApiResponse(200, update, "tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "please provide the tweet id");
  }

  if (!req.user) {
    throw new ApiError(401, "please login first");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "tweet not found");
  }

  if (String(req.user?._id) !== String(tweet?.owner)) {
    throw new ApiError(
      403,
      "you are not the owner of the tweet you can't delete it"
    );
  }

  const deleted = await Tweet.findByIdAndDelete(tweet._id);

  res
    .status(200)
    .json(new ApiResponse(200, deleted, "tweet deleted successfully"));
});

const getAllTweets = asyncHandler(async (req, res) => {
  const user = req?.user;

  if (!user) {
    throw new ApiError(401, "please login");
  }

  const tweets = await Tweet.find().populate({
    path: "owner",
    select: "-password -refreshToken",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "all tweets fetch sucessfully"));
});

const getOwnersTweets = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "please logIn");
  }

  const tweet = await Tweet.find({ owner: user?._id }).populate(
    "owner",
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "users tweet fetch successfully"));
});

export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  getAllTweets,
  getOwnersTweets,
};
