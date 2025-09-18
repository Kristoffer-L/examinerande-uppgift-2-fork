import mongoose, { Schema, Types } from "mongoose";
import type { Document } from "mongoose";
import type { ITask } from "./task.js";

export interface IProject extends Document {
  title: string;
  description: string;
  // tasks: ITask["_id"][];
  tasks: (Types.ObjectId | ITask)[];
}

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String },
    // tasks: [{ type: String, ref: "task" }],
    tasks: [{ type: Types.ObjectId, ref: "Task" }],
  },
  { collection: "project" }
);
export const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema);
