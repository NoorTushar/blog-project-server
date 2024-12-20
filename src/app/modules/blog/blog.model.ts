import { model, Schema } from "mongoose";
import { TBlog } from "./blog.interface";

const blogSchema = new Schema<TBlog>(
   {
      title: {
         type: String,
         required: [true, "Blog title is required."],
      },

      content: {
         type: String,
         required: [true, "Blog content is required"],
      },

      author: {
         type: Schema.Types.ObjectId,
         required: [true, "Blog author is required."],
         ref: "User",
      },

      isPublished: {
         type: Boolean,
         default: true,
      },
   },
   {
      timestamps: true,
   }
);

export const BlogModel = model<TBlog>("Blog", blogSchema);
