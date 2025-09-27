import { findProject } from "../db/projectCrud.js";
import mongoose, { Types } from "mongoose";

export const getUserRoleInProject = async (
  projectId: Types.ObjectId | string,
  userId: Types.ObjectId | string
): Promise<"admin" | "member" | "viewer" | null> => {
  if (
    !mongoose.isValidObjectId(projectId) ||
    !mongoose.isValidObjectId(userId)
  ) {
    return null;
  }

  const project = await findProject(projectId);
  if (!project) return null;

  const projectUser = project.users.find(
    (user) => user.userId.toString() === userId.toString()
  );

  return projectUser ? projectUser.role : null;
};

export default getUserRoleInProject;
