/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";

const createUserIntoDB = async (payload: TUser) => {
   // Create the user in the database
   const result = await UserModel.create(payload);
   console.log(result);

   // Convert Mongoose document to plain object
   const { password, ...userWithoutPassword } = result.toObject();

   console.log(userWithoutPassword);

   return userWithoutPassword; // Return the sanitized user object
};

const getAllUsersFromDB = async () => {
   const result = await UserModel.find();
   return result;
};

export const UserServices = {
   createUserIntoDB,
   getAllUsersFromDB,
};
