import mongoose, { Schema, Types } from "mongoose";
import type { Document } from "mongoose";
import type { ITask } from "./task.js";
import type { IUser } from "./user.js";

export interface IProjectUser {
  userId: Types.ObjectId | IUser;
  role: "admin" | "member" | "viewer";
}

export type IProjectUserInput = {
  userId: string;
  role: "admin" | "member" | "viewer";
};

export interface IProject extends Document {
  title: string;
  description: string;
  tasks: (Types.ObjectId | ITask)[];
  ownerId: Types.ObjectId | IUser;
  users: IProjectUser[];
}

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [20, "Title cannot exceed 20 characters"],
    },
    description: { type: String },
    tasks: [{ type: Types.ObjectId, ref: "Task" }],
    ownerId: { type: Types.ObjectId, ref: "User" },
    users: [
      {
        userId: { type: Types.ObjectId, ref: "User", required: true },
        role: {
          type: String,
          enum: ["admin", "member", "viewer"],
          default: "viewer",
        },
      },
    ],
  },
  { collection: "project" }
);
export const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema);
