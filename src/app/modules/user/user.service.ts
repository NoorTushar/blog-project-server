import { TUser } from "./user.interface";
import { UserModel } from "./user.model";

const createUserIntoDB = async (payload: TUser) => {
   const result = await UserModel.create(payload);

   return result;
};

const getAllUsersFromDB = async () => {
   const result = await UserModel.find();
   return result;
};

export const UserServices = {
   createUserIntoDB,
   getAllUsersFromDB,
};
