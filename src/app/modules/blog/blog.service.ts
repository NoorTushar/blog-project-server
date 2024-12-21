import { JwtPayload } from "jsonwebtoken";
import { blogSearchTerms } from "./blog.constants";
import { TBlog } from "./blog.interface";
import { BlogModel } from "./blog.model";
import { UserModel } from "../user/user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createBlogIntoDB = async (decodedUser: JwtPayload, payload: TBlog) => {
   const { email } = decodedUser;

   const author = await UserModel.findOne({ email });

   if (!author) {
      throw new AppError(httpStatus.NOT_FOUND, "Author not found");
   }

   const authorId = author?._id;

   payload.author = authorId;

   const result = await BlogModel.create(payload);
   return result;
   // return null;
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

   // sortOrder: Defines the sorting order. Accepts values asc (ascending) or desc (descending). (e.g., sortOrder=desc).

   let sortStr;

   if (query?.sortBy && query?.sortOrder) {
      const sortBy = query?.sortBy;
      const sortOrder = query?.sortOrder;

      sortStr = `${sortOrder === "desc" ? "-" : ""}${sortBy}`;
   }

   const sortQuery = await filterQuery.sort(sortStr);

   return sortQuery;
};

const getSingleBlogFromDB = async (id: string) => {
   const result = await BlogModel.findById(id).populate("author");

   if (!result) {
      throw new AppError(
         httpStatus.NOT_FOUND,
         "There is no blog under this Id"
      );
   }
   return result;
};

const updateBlogIntoDB = async (
   decodedUser: JwtPayload,
   id: string,
   payload: Partial<TBlog>
) => {
   // the blog to be updated
   const blog = await BlogModel.findById(id);
   if (!blog) {
      throw new AppError(
         httpStatus.NOT_FOUND,
         "The blog you are trying to update, does not exist"
      );
   }

   // check if the id found in decoded user matches with the id to be edited
   const user = await UserModel.findOne({ email: decodedUser.email });
   const userId = user?._id;

   // Allows a logged-in user to update their own blog by its ID.

   const authorId = blog.author;

   const matchedUserAndAuthor = userId?.equals(authorId);

   if (!matchedUserAndAuthor) {
      throw new AppError(
         httpStatus.FORBIDDEN,
         "You are trying to update another user's blog"
      );
   }

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

   const authorId = blog.author;

   const matchedUserAndAuthor = userId?.equals(authorId);

   if (!matchedUserAndAuthor) {
      throw new AppError(
         httpStatus.FORBIDDEN,
         "You are trying to delete another user's blog"
      );
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
