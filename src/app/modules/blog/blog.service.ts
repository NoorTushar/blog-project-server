import { blogSearchTerms } from "./blog.constants";
import { TBlog } from "./blog.interface";
import { BlogModel } from "./blog.model";

const createBlogIntoDB = async (payload: TBlog) => {
   const result = await BlogModel.create(payload);
   return result;
};

const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
   // search: Filters blogs containing the term "technology" in the title or content.
   const search = query?.search || "";
   const searchQuery = BlogModel.find({
      $or: blogSearchTerms.map((term) => {
         return {
            [term]: { $regex: search, $options: "i" },
         };
      }),
   }).populate("author");

   // filter: Filters blogs authored by the user with the given authorId.
   const filter = query?.filter ? { author: query.filter } : {};
   const filterQuery = searchQuery.find(filter);

   //sortOrder: Defines the sorting order. Accepts values asc (ascending) or desc (descending). (e.g., sortOrder=desc).
   const sortOrder = query?.sortOrder ? (query?.sortOrder as string) : "desc";
   const sortQuery = filterQuery.sort({ createdAt: sortOrder });

   //sortBy: Sort blogs by specific fields such as createdAt or title (e.g., sortBy=title).
   const fields = (query.sortBy as string) || "-__v";
   const fieldQuery = await sortQuery.select(fields);

   return fieldQuery;
};

const getSingleBlogFromDB = async (id: string) => {
   const result = await BlogModel.findById(id).populate("author");
   return result;
};

const updateBlogIntoDB = async (id: string, payload: Partial<TBlog>) => {
   // Allows a logged-in user to update their own blog by its ID.

   const result = await BlogModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
   });

   return result;
};

const deleteBlogFromDB = async (id: string) => {
   // Allows a logged-in user to delete their own blog by its ID.
   const result = await BlogModel.findByIdAndDelete(id);

   return result;
};

export const BlogServices = {
   createBlogIntoDB,
   getAllBlogsFromDB,
   getSingleBlogFromDB,
   updateBlogIntoDB,
   deleteBlogFromDB,
};
