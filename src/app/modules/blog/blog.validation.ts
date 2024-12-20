import { z } from "zod";

const createBlogValidationSchema = z.object({
   body: z.object({
      title: z.string({
         invalid_type_error: "Blog title must be string",
         required_error: "Blog title is required",
      }),

      content: z.string({
         invalid_type_error: "Blog content must be string",
         required_error: "Blog content is required",
      }),

      author: z.string({
         invalid_type_error: "Blog author must be string",
         required_error: "Blog author is required",
      }),
   }),
});

export const BlogValidations = {
   createBlogValidationSchema,
};
