import { Types } from "mongoose";
import { ProjectModel } from "./models/project.js";
import { TaskModel } from "./models/task.js";
import type { IProject } from "./models/project.js";

export const createProject = async (project: IProject, user: string) => {
  const projectWithOwner = {
    ...project,
    ownerId: new Types.ObjectId(user), // Ensure ownerId is an ObjectId
  };
  const newProject = new ProjectModel(projectWithOwner);
  return await newProject.save();
};

export const findProjects = async () => {
  const projects = await ProjectModel.find().populate("tasks").exec();
  return projects;
};

export const findProject = async (id: string) => {
  return ProjectModel.findById(id);
};

export const updateProject = async (id: string, project: Partial<IProject>) => {
  return ProjectModel.findByIdAndUpdate(id, project, {
    new: true,
    runValidators: true,
  });
};

export const deleteProject = async (id: string) => {
  await TaskModel.deleteMany({ project: id });

  return ProjectModel.findByIdAndDelete(id);
};

export const assignTaskToProject = async (
  projectId: string,
  taskId: string
) => {
  const project = await ProjectModel.findById(projectId);
  if (!project) throw new Error("Project not found");
  const objectId = new Types.ObjectId(taskId);

  if (!project.tasks.includes(objectId)) {
    project.tasks.push(objectId);
  }
  await project.save();
  return project;
};
