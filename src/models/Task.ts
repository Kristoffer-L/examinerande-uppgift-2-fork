// models/Movie.js
import mongoose, { Schema, Document, Types } from "mongoose";
import type { IUser } from "./User.js";

export interface ITask extends Document {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedTo: IUser["_id"];
  createdAt: Date;
  finishedAt: Date;
}

const TaskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, index: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["to-do", "in progress", "blocked", "done"],
      default: "to-do",
    },
    assignedTo: { type: Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
  },
  { collection: "tasks" }
);
export const Task = mongoose.model<ITask>("Task", TaskSchema);
