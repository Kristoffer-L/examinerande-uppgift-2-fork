// models/Movie.js
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema(
  {
    id: { type: Types.ObjectId, required: true },
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { collection: "users" }
);
export const User = mongoose.model<IUser>("User", UserSchema);
