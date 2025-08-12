import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErros.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthcheck = asyncHandler(async (req, res) => {
 

  return res.status(200).json(new ApiResponse(200, "every thing is ok"));
});

export { healthcheck };
