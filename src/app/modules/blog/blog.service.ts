import { JwtPayload } from "jsonwebtoken";
import { blogSearchTerms } from "./blog.constants";
import { TBlog } from "./blog.interface";
import { BlogModel } from "./blog.model";
import { UserModel } from "../user/user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

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
   // the blog to be updated
   const blog = await BlogModel.findById(id);
   if (!blog) {
      throw new AppError(
         httpStatus.NOT_FOUND,
         "The blog you are trying to update, does not exist"
      );
   }

   // Allows a logged-in user to update their own blog by its ID.

   const result = await BlogModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
   });

   return result;
};

const deleteBlogFromDB = async (decodedUser: JwtPayload, id: string) => {
   // the blog to be deleted
   const blog = await BlogModel.findById(id);
   if (!blog) {
      throw new AppError(
         httpStatus.NOT_FOUND,
         "The blog you are trying to delete, does not exist"
      );
   }

   // check if the id found in decoded user matches with the id to be deleted
   const user = await UserModel.findOne({ email: decodedUser.email });
   const userId = user?._id;

   // if the role is user, check if the right user is deleting their blog
   if (user?.role === "user") {
      const authorId = blog.author;

      const matchedUserAndAuthor = userId?.equals(authorId);

      if (!matchedUserAndAuthor) {
         throw new AppError(
            httpStatus.FORBIDDEN,
            "You are trying to delete another user's blog"
         );
      }
   }

   // Allows a logged-in user to delete their own blog by its ID.
   const result = await BlogModel.findByIdAndDelete(id);

   return result;
   // return null;
};

export const BlogServices = {
   createBlogIntoDB,
   getAllBlogsFromDB,
   getSingleBlogFromDB,
   updateBlogIntoDB,
   deleteBlogFromDB,
};
