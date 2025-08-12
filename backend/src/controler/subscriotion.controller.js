import { ApiError } from "../utils/ApiErros.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Subscription } from "../models/subcription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(400, "please provide the channel id");
  }

  if (!req.user) {
    throw new ApiError(
      403,
      "please login to do operation releted to subscription"
    );
  }

  const channelExists = await User.findById(channelId);
  if (!channelExists) {
    throw new ApiError(404, "Channel not found.");
  }

  const isSubscribe = await Subscription.findOne({
    $and: [{ subscriber: req.user?._id }, { channel: channelId }],
  });

  let val, ans;

  // if subsccribed to chainnel the unsubscribe
  if (isSubscribe) {
    //unscribing the channel by deleting the document
    await Subscription.findByIdAndDelete(isSubscribe._id);
    val = null;
    ans = "channel unsubscribed successfully";
  } else {
    //subscribing the channel
    val = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
    ans = "channel subscribed successfully";
  }

  return res.status(200).json(new ApiResponse(200, val, ans));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(400, "please provide the channel id");
  }

  const ChannelExist = await User.findById(channelId);

  if (!ChannelExist) {
    throw new ApiError(400, "channel does not exist");
  }

  const subscriber = await Subscription.find({
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscriber },
        "subscriberCount fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!subscriberId) {
    throw new ApiError(400, "please provide the subscriberId");
  }

  const subscriberExist = await User.findById(subscriberId);

  if (!subscriberExist) {
    throw new ApiError(400, "subscriber does not exist");
  }

  const channels = await Subscription.find({
    subscriber: subscriberId,
  })
    .populate("channel")
    .populate("subscriber");

  return res
    .status(200)
    .json(
      new ApiResponse(200, { channels }, "subscriberCount fetched successfully")
    );
});

const isSubscribe = asyncHandler(async (req, res) => {
  const user = req?.user;
  const { channelId } = req.params;

  if (!user) {
    throw new ApiError(401, "please login");
  }

  const ChannelExist = await User.findById(channelId);

  if (!ChannelExist) {
    throw new ApiError(404, "channel does not exist");
  }

  const data = await Subscription.find({
    $and: [{ subscriber: user._id }, { channel: channelId }],
  });

  const isSub = data.length > 0;

  return res
    .status(200)
    .json(
      new ApiResponse(200, isSub, "Subscription status fetched successfully")
    );
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
  isSubscribe,
};
