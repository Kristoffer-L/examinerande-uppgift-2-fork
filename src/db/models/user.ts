import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      minlength: [5, "Name must be at least 5 characters long"],
      maxlength: [20, "Name cannot exceed 20 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Name can only contain letters, numbers, and underscores",
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { collection: "users" }
);
export const UserModel = mongoose.model<IUser>("User", UserSchema);
