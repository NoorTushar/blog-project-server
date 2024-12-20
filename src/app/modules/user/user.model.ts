import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import { UserRoles } from "./user.constants";

const userSchema = new Schema<TUser>(
   {
      name: {
         type: String,
         required: [true, "User name is required."],
      },
      email: {
         type: String,
         unique: true,
         required: [true, "User email is required"],
      },
      password: {
         type: String,
         required: [true, "User password is required."],
      },
      role: {
         type: String,
         enum: UserRoles,
         default: "user",
      },
      isBlocked: {
         type: Boolean,
         default: false,
      },
   },
   {
      timestamps: true,
   }
);

export const UserModel = model<TUser>("User", userSchema);
