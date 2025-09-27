import mongoose, { Schema, Types } from "mongoose";
import type { Document } from "mongoose";
import type { IUser } from "./user.js";

export interface ITask extends Document {
  projectId: Types.ObjectId;
  title: string;
  description: string;
  status: string;
  // tags: string;
  assignedTo: IUser["_id"] | null;
  createdAt: Date;
  finishedAt: Date;
  finishedBy: IUser["_id"] | null;
}

const TaskSchema = new Schema(
  {
    projectId: { type: Types.ObjectId, ref: "Project" },
    title: {
      type: String,
      required: true,
      index: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [20, "Title cannot exceed 20 characters"],
    },
    description: { type: String },
    status: {
      type: String,
      enum: ["to-do", "in progress", "blocked", "done"],
      default: "to-do",
    },
    // tags: {
    //   type: String,
    //   enum: ["frontend", "backend", "design", "database"],
    //   default: "",
    // },
    assignedTo: { type: Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    finishedAt: { type: Date, default: null },
    finishedBy: { type: Types.ObjectId, ref: "User", default: null },
  },
  { collection: "tasks" }
);
export const TaskModel = mongoose.model<ITask>("Task", TaskSchema);
