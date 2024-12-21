import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { BlogModel } from "../blog/blog.model";

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
   deleteBlogFromDB,
};
