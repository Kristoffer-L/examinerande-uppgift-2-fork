import { UserModel } from "./models/user.js";
import { TaskModel } from "./models/task.js";
import type { IUser } from "./models/user.js";

export const createUser = async (user: IUser) => {
  const newUser = new UserModel(user);
  return await newUser.save();
};

export const findUsers = async () => {
  const users = await UserModel.find().lean();
  return users;
};

export const findUser = async (id: string) => {
  return UserModel.findById(id);
};

export const updateUser = async (id: string, user: Partial<IUser>) => {
  return UserModel.findByIdAndUpdate(id, user, {
    new: true,
    runValidators: true,
  });
};

export const deleteUser = async (id: string) => {
  await TaskModel.updateMany(
    { assignedTo: id },
    { $unset: { assignedTo: null } }
  );
  return UserModel.findByIdAndDelete(id);
};
