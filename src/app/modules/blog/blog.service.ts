import { blogSearchTerms } from "./blog.constants";
import { TBlog } from "./blog.interface";
import { BlogModel } from "./blog.model";

const createBlogIntoDB = async (payload: TBlog) => {
   const result = await BlogModel.create(payload);
   return result;
};

const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
   const queryObj = { ...query };

   const search = query?.search || "";

   const searchQuery = BlogModel.find({
      $or: blogSearchTerms.map((term) => {
         return {
            [term]: { $regex: search, $options: "i" },
         };
      }),
   });

   const excludeFields = ["search"];

   excludeFields.forEach((field) => delete queryObj[field]);
   console.log({ queryObj });
   console.log({ query });

   const filter = query.filter ? { _id: query.filter } : {};

   const result = await searchQuery.find(filter);

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
