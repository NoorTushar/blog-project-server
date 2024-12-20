import { z } from "zod";

const createUserValidationSchema = z.object({
   body: z.object({
      name: z
         .string()
         .min(5, { message: "User name must be at least of 5 characters" })
         .max(30, { message: "User name must not exceed 30 characters" }),

      password: z
         .string()
         .min(5, { message: "Password must be at least of 5 characters" })
         .max(20, { message: "Password must not exceed 20 characters" }),

      email: z.string().email({ message: "Invalid email address" }),
   }),
});

export const UserValidations = {
   createUserValidationSchema,
};
