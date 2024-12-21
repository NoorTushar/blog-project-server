import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogServices } from "./blog.service";

const createBlog = catchAsync(async (req, res) => {
   const result = await BlogServices.createBlogIntoDB(req.body);

   sendResponse(res, {
      data: result,
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Blog created successfully",
   });
});

const getAllBlogs = catchAsync(async (req, res) => {
   const result = await BlogServices.getAllBlogsFromDB(req.query);
   sendResponse(res, {
      data: result,
      statusCode: httpStatus.OK,
      success: true,
      message: "Blogs fetched successfully",
   });
});

const getSingleBlog = catchAsync(async (req, res) => {
   const result = await BlogServices.getSingleBlogFromDB(req.params.id);
   sendResponse(res, {
      data: result,
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog fetched successfully",
   });
});

const updateBlog = catchAsync(async (req, res) => {
   const result = await BlogServices.updateBlogIntoDB(req.params.id, req.body);
   sendResponse(res, {
      data: result,
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog updated successfully",
   });
});

const deleteBlog = catchAsync(async (req, res) => {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
   const result = await BlogServices.deleteBlogFromDB(req.params.id);
   sendResponse(res, {
      // data: result,
      statusCode: httpStatus.OK,
      success: true,
      message: "Blog deleted successfully",
   });
});

export const BlogController = {
   createBlog,
   getAllBlogs,
   getSingleBlog,
   updateBlog,
   deleteBlog,
};
