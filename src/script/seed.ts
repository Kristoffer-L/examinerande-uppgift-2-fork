import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { ProjectModel } from "../db/models/project.js";
import { TaskModel } from "../db/models/task.js";
import { UserModel } from "../db/models/user.js";
import bcrypt from "bcrypt";

dotenv.config();

const saltRounds = 10;

const MONGO_URI: string | undefined = process.env.MONGO_URI;
const DB_NAME: string | undefined = process.env.DB_NAME;

// Helper to pick a random item from array
const rand = <T>(arr: T[], arrName = "array"): T => {
  if (!arr || arr.length === 0) {
    throw new Error(`Array is empty, cannot pick random element: ${arrName}`);
  }
  return arr[Math.floor(Math.random() * arr.length)]!;
};

async function seedDatabase() {
  if (!MONGO_URI) throw new Error("Missing MONGODB_URI in .env");
  if (!DB_NAME) throw new Error("Missing DB_NAME in .env");
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log("Connected:", MONGO_URI.split("@")[1]);

  // Reset database
  await Promise.all([
    ProjectModel.deleteMany({}),
    TaskModel.deleteMany({}),
    UserModel.deleteMany({}),
  ]);

  const users = await Promise.all(
    Array.from({ length: 10 }).map(async (arg, index) => {
      const plainPassword = `Password${index}`;
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

      return {
        name: faker.internet.username().substring(0, 20),
        email:
          faker.internet.email().toLowerCase() +
          Date.now() +
          Math.floor(Math.random() * 1000),
        password: hashedPassword,
      };
    })
  );
  const userDocs = await UserModel.insertMany(users, {
    ordered: false,
  });
  console.log("Inserted userDocs:", userDocs.length);

  const projects = await Promise.all(
    Array.from({ length: 10 }).map(() => {
      const ownerId = rand(userDocs)._id;

      return {
        title: faker.company.name(),
        description: faker.lorem.sentence(),
        tasks: [],
        ownerId: ownerId,
        users: [
          {
            userId: ownerId,
            role: "admin",
          },
          {
            userId: rand(userDocs)._id,
            role: rand(["viewer", "member", "admin"]),
          },
        ],
      };
    })
  );
  const projectDocs = await ProjectModel.insertMany(projects, {
    ordered: false,
  });
  console.log("Inserted projects:", projectDocs.length);

  const tasks = Array.from({ length: 20 }).map(() => ({
    projectId: rand(projectDocs)._id,
    title: faker.company.name(),
    description: faker.lorem.sentence(),
    status: rand(["todo", "in-progress", "blocked"]),
    tags: rand(["frontend", "backend", "design", "database", ""]),
    assignedTo: rand(userDocs)._id,
  }));
  const taskDocs = await TaskModel.insertMany(tasks, { ordered: false });
  console.log("Inserted taskDocs:", taskDocs.length);

  // Group tasks by projectId
  const tasksByProject: Record<string, string[]> = {};
  taskDocs.forEach((task: any) => {
    const pid = task.projectId.toString();
    if (!tasksByProject[pid]) tasksByProject[pid] = [];
    tasksByProject[pid].push(task._id);
  });

  // Update projects with their tasks
  await Promise.all(
    Object.entries(tasksByProject).map(([projectId, taskIds]) =>
      ProjectModel.findByIdAndUpdate(projectId, {
        $push: { tasks: { $each: taskIds } },
      })
    )
  );

  const totalUsers = await UserModel.countDocuments();
  const totalProjects = await ProjectModel.countDocuments();
  const totalTask = await TaskModel.countDocuments();

  console.log(
    `Seeding completed: ${totalUsers} totalUsers, ${totalProjects} totalProjects, ${totalTask} totalTask.`
  );

  await mongoose.disconnect();
}

seedDatabase().catch((e) => {
  console.error(e);
  process.exit(1);
});
