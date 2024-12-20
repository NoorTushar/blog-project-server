import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import { UserRoles } from "./user.constants";

import bcrypt from "bcrypt";
import config from "../../config";

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
         select: false,
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

userSchema.pre("save", async function (next) {
   this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
   );

   next();
});

userSchema.post("save", function (doc, next) {
   doc.password = "";
   next();
});

export const UserModel = model<TUser>("User", userSchema);
