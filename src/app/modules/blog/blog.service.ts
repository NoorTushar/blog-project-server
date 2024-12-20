import { TBlog } from "./blog.interface";
import { BlogModel } from "./blog.model";

const createBlogIntoDB = async (payload: TBlog) => {
   const result = await BlogModel.create(payload);
   return result;
};

const getAllBlogsFromDB = async () => {
   const result = await BlogModel.find().populate("author");
   return result;
};

const getSingleBlogFromDB = async (id: string) => {
   const result = await BlogModel.findById(id).populate("author");
   return result;
};

export const BlogServices = {
   createBlogIntoDB,
   getAllBlogsFromDB,
   getSingleBlogFromDB,
};
