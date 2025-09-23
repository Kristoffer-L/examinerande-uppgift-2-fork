import mongoose, { Schema, Types } from "mongoose";
import type { Document } from "mongoose";
import type { ITask } from "./task.js";
import type { IUser } from "./user.js";

export interface IProject extends Document {
  title: string;
  description: string;
  // tasks: ITask["_id"][];
  tasks: (Types.ObjectId | ITask)[];
  ownerId: Types.ObjectId | IUser;
}

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String },
    tasks: [{ type: Types.ObjectId, ref: "Task" }],
    ownerId: { type: Types.ObjectId, ref: "User" },
  },
  { collection: "project" }
);
export const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema);
