import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser = catchAsync(async (req, res) => {
   const result = await UserServices.createUserIntoDB(req.body);

   sendResponse(res, {
      data: result,
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User registered successfully",
   });
});

const getAllUsers = catchAsync(async (req, res) => {
   const result = await UserServices.getAllUsersFromDB();

   sendResponse(res, {
      data: result,
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Users retrieved successfully",
   });
});

export const UserControllers = {
   createUser,
   getAllUsers,
};
