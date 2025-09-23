import { TaskModel } from "./models/task.js";
import { ProjectModel } from "./models/project.js";
import type { ITask } from "./models/task.js";

export const createTask = async (task: ITask, projectId: string) => {
  const taskWithProject = {
    ...task,
    projectId: projectId,
  };
  const newTask = await new TaskModel(taskWithProject).save();
  const updatedProject = await ProjectModel.findByIdAndUpdate(
    projectId,
    { $push: { tasks: newTask._id } },
    { new: true }
  );
  return { newTask, updatedProject };
};

export const findTasks = async () => {
  const tasks = await TaskModel.find().lean();
  return tasks;
};

export const findTask = async (id: string) => {
  return TaskModel.findById(id);
};

export const updateTask = async (id: string, task: Partial<ITask>) => {
  return TaskModel.findByIdAndUpdate(id, task, {
    new: true,
    runValidators: true,
  });
};

export const deleteTask = async (id: string) => {
  return TaskModel.findByIdAndDelete(id);
};

export const statusChangeTask = async (
  taskId: string,
  taskStatus: string,
  doneStatus: Date | null,
  doneUserId?: string | null
) => {
  return TaskModel.findByIdAndUpdate(
    taskId,
    {
      status: taskStatus,
      finishedAt: doneStatus,
      finishedBy: doneUserId,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export const assignedTask = async (taskId: string, userId: string) => {
  return TaskModel.findByIdAndUpdate(
    taskId,
    { assignedTo: userId },
    {
      new: true,
      runValidators: true,
    }
  );
};
