import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { BlogModel } from "../blog/blog.model";
import { UserModel } from "../user/user.model";

const blockUserFromDB = async (id: string) => {
   const user = await UserModel.findById(id);

   if (!user) {
      throw new AppError(
         httpStatus.NOT_FOUND,
         "The user you are trying to block, does not exist"
      );
   }

   const result = await UserModel.findByIdAndUpdate(id, { isBlocked: true });
   return result;
};

const deleteBlogFromDB = async (id: string) => {
   // the blog to be deleted
   const blog = await BlogModel.findById(id);
   if (!blog) {
      throw new AppError(
         httpStatus.NOT_FOUND,
         "The blog you are trying to delete, does not exist"
      );
   }

   // Allows a logged-in user to delete their own blog by its ID.
   const result = await BlogModel.findByIdAndDelete(id);

   return result;
   // return null;
};

export const AdminServices = {
   blockUserFromDB,
   deleteBlogFromDB,
};
