import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserFromDB = async (payload: TLoginUser) => {
   console.log({ payload });

   const user = await UserModel.findOne({ email: payload.email }).select(
      "+password"
   );

   // check if the user exists in the database
   if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
   }

   // check if the user is blocked or not
   if (user.isBlocked) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is blocked");
   }

   // check if the provided password matches with the database password
   const isPasswordMatched = await bcrypt.compare(
      payload?.password,
      user?.password
   );

   if (!isPasswordMatched) {
      throw new AppError(httpStatus.FORBIDDEN, "Incorrect Password");
   }

   // generate JWT Token:
   const jwtPayload = { email: user.email, role: user.role };

   const accessToken = jwt.sign(
      jwtPayload,
      config.jwt_access_secret as string,
      {
         expiresIn: "30d",
      }
   );

   return { token: accessToken };
};

export const AuthServices = {
   loginUserFromDB,
};
