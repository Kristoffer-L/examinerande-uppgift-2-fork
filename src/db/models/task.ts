import mongoose, { Schema, Types } from "mongoose";
import type { Document } from "mongoose";
import type { IUser } from "./user.js";

export interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  assignedTo: IUser["_id"];
  createdAt: Date;
  finishedAt: Date;
  project: Types.ObjectId;
}

const TaskSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["to-do", "in progress", "blocked", "done"],
      default: "to-do",
    },
    assignedTo: { type: Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    finishedAt: { type: Date, default: null },
    project: { type: Types.ObjectId, ref: "Project" },
  },
  { collection: "tasks" }
);
export const TaskModel = mongoose.model<ITask>("Task", TaskSchema);
