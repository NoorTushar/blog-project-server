/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const deleteBlog = catchAsync(async (req, res) => {
   const result = await AdminServices.deleteBlogFromDB(req.params.id);

   sendResponse(res, {
      // data: result,
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog deleted successfully",
   });
});

export const AdminControllers = {
   deleteBlog,
};
