import { TaskModel } from "./models/task.js";
import type { ITask } from "./models/task.js";

export const createTask = async (task: ITask) => {
  const newTask = new TaskModel(task);
  return await newTask.save();
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
  doneStatus: Date | null
) => {
  return TaskModel.findByIdAndUpdate(
    taskId,
    {
      status: taskStatus,
      finishedAt: doneStatus,
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
