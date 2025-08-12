import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErros.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || //req.header("Authorization")?.replace("Bearer ", "")
      req.header("Authorization")?.replace("Bearer ", "");

      // console.log(token)
    if (!token) {
      // return res.status(200).json("unotherised user or request");
      throw new ApiError(401, "unotherised user or request");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "invalid access token ");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid access token ");
  }
});
