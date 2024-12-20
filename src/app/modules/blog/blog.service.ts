import { blogSearchTerms } from "./blog.constants";
import { TBlog } from "./blog.interface";
import { BlogModel } from "./blog.model";

const createBlogIntoDB = async (payload: TBlog) => {
   const result = await BlogModel.create(payload);
   return result;
};

const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
   console.log(query);

   const search = query?.search || "";

   //    const result = await BlogModel.find({
   //       $or: [
   //          { title: { $regex: search, $options: "i" } },
   //          { content: { $regex: search, $options: "i" } },
   //       ],
   //    }).populate("author");

   const searchQuery = BlogModel.find({
      $or: blogSearchTerms.map((term) => {
         return {
            [term]: { $regex: search, $options: "i" },
         };
      }),
   }).populate("author");

   const result = await searchQuery;

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
