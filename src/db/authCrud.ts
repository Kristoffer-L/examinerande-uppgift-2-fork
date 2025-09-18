import { Types } from "mongoose";
import { UserModel } from "./models/user.js";

export const signinUser = async (email: string) => {
  const user = await UserModel.findOne({ email });
  return user;
};
