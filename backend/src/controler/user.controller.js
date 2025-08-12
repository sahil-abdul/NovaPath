import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErros.js";
import { fileUpload } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    // console.log(user.createRefreshTokens()

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    // const refreshToken =  user.createRefreshToken();

    // console.log(refreshToken)
    User.refreshToken = refreshToken;

    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error.message || "error duaring genrating the access nd refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // take the data from the user
  // check the data is coming or not
  // check the user is already exit ?
  // if already exits thro error
  // else take the cover image and avatar from multr
  // upload to local storage avtar and cover image
  // check the avatar and cover image is store localy or not
  // upload the files to cloudinary
  // check the file i proply uploded or not
  // create a user
  // remove the password and refrence token field from the user
  // return the response

  const { fullName, email, username, password } = req.body;

  if (!(fullName && email && username && password)) {
    throw new ApiError(400, "please provide all feilds");
  }

  if (
    [fullName, email, username, password].some((feild) => feild.trim() == "")
  ) {
    throw new ApiError(400, "please provide all valid feilds");
  }

  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExist) {
    throw new ApiError(408, "the email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar[0].path;
  let coverImageLocalpath; // = req.files?.coverimage[0].path

  if (
    req.files &&
    Array.isArray(req.files.coverimage) &&
    req.files.coverimage.length > 0
  ) {
    coverImageLocalpath = req.files.coverimage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(409, "the avatar required");
  }

  const avatar = await fileUpload(avatarLocalPath);
  const coverimage = await fileUpload(coverImageLocalpath);

  if (!avatar) {
    throw new ApiError(409, "avatar not uploadd properly");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong duaring creatin of the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, createdUser, "user register successfully"));
});

const logInUser = asyncHandler(async (req, res) => {
  // get thedata from the user
  // check the data is coming or not
  // find user in database if not get then throw err
  // check the password
  // create tokens
  // send tokens in cookies
  // return the result

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(401, "email or username required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "email or username are incorrect");
  }
  // console.log(user)

  const isPassValid = await user.isPasswordCorrect(password);

  if (!isPassValid) {
    throw new ApiError(403, "password is incorrect");
  }

  const { accessToken, refreshToken } = await createAccessAndRefreshToken(
    user._id
  );

  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: refreshToken,
      },
    },
    {
      new: true,
    }
  );

  const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: refreshToken,
          accessToken,
          logedInUser,
        },
        "user logIn succesfuly"
      )
    );
});

const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logOut successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRfeshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRfeshToken) {
    throw new ApiError(401, "unotherissed request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRfeshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }
    // console.log(incomingRfeshToken)

    if (incomingRfeshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or used");
    }

    const { accessToken, newRefreshToken } = await createAccessAndRefreshToken(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          201,
          { accessToken, refreshToken: newRefreshToken },
          "access token refresh successFuly"
        )
      );
  } catch (error) {
    throw new ApiError(401, error.message || "unotherissed request");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(401, "you are not login");
  }

  const validatePass = await user.isPasswordCorrect(oldPassword);

  if (!validatePass) {
    throw new ApiError(401, "wrong old password");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(201, "password updated successfuly"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
     return res
    .status(200)
    .json(new ApiResponse(200,null, "user is not logIn"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "here is you current user"));
});

const updateUserDetail = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName && !email) {
    throw new ApiError(400, "All fiels are requred");
  }

  if (!req.user) {
    throw new ApiError(400, "please login first");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "details updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const user = req.user;
  // console.log(req.file)
  if (!user) {
    throw new ApiError(401, "please login to update the avatar");
  }
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar requred");
  }

  const avatar = await fileUpload(avatarLocalPath);
  // console.log(avatar)

  if (!avatar?.url) {
    throw new ApiError(400, "error while updating the avatar");
  }

  const newUser = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, newUser, "avatar updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const user = req.user;
  // console.log(req.files)
  if (!user) {
    throw new ApiError(401, "please login to update the avatar");
  }
  const coverImageLocalPath = req.file?.path;
  // console.log(avatarLocalPath);

  if (!coverImageLocalPath) {
    throw new ApiError(400, "coverImage requred");
  }

  const coverImage = await fileUpload(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "error while updating the coverImage");
  }

  const newUser = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        coverimage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, newUser, "cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(409, "userId is required");
  }

  //agrigating the channel
  const channel = await User.aggregate([
    //mathcing the data from the databse with this username
    {
       $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "subscriptions", // kaha se data lana hai
        localField: "_id", // user ki konti feild se marhc karana hai
        foreignField: "channel", // subscription model ke konse fiels se marthc karana hai
        as: "subscribers", // name of the array ehich contain the resultant feilds
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscriberTo",
      },
    },
    {
      //joining the feilds into single feild
      $addFields: {
        subscribersCount: {
          // return the count of the subscriber
          $size: "$subscribers",
        },
        subscribeToChannelCount: {
          // return the count to subscribe hoe may chainnels
          $size: "$subscriberTo",
        },
        isSubscribe: {
          // subscribe to perticular chainel aor not
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true, // return true if subscibe
            else: false, // return false if not subscribe
          },
        },
      },
    },
    {
      //values that are returning
      $project: {
        username: 1,
        fullName: 1,
        email: 1,
        avatar: 1,
        coverimage: 1,
        subscribersCount: 1,
        subscribeToChannelCount: 1,
        isSubscribe: 1,
      },
    },
  ]);

  // console.log(channel);

  if (!channel?.length) {
    throw new ApiError(401, "channel does not exists");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, channel[0], "data fetch successdully"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "owner",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    email: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  // console.log(user)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "watchHistort fetch successfully"
      )
    );
});

export {
  registerUser,
  logInUser,
  logOut,
  refreshAccessToken,
  resetPassword,
  getCurrentUser,
  updateUserDetail,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
