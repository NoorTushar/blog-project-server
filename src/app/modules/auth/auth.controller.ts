import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
   const result = await AuthServices.loginUserFromDB(req.body);

   sendResponse(res, {
      data: result,
      statusCode: httpStatus.OK,
      success: true,
      message: "Login successful",
   });
});

export const AuthControllers = {
   loginUser,
};
