import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { ProjectModel } from "../db/models/project.js";
import { TaskModel } from "../db/models/task.js";
import { UserModel } from "../db/models/user.js";

dotenv.config();

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

  const users = Array.from({ length: 8 }).map(() => ({
    name: faker.internet.username().substring(0, 20),
    email:
      faker.internet.email().toLowerCase() +
      Date.now() +
      Math.floor(Math.random() * 1000),
    password: faker.internet.password({ length: 8 }),
  }));
  const userDocs = await UserModel.insertMany(users, {
    ordered: false,
  });
  console.log("Inserted userDocs:", userDocs.length);

  const projects = Array.from({ length: 8 }).map(() => ({
    title: faker.company.name(),
    ownerId: rand(userDocs)._id,
    users: [
      { userId: rand(userDocs)._id, role: rand(["viewer", "member", "admin"]) },
    ],
  }));
  const projectDocs = await ProjectModel.insertMany(projects, {
    ordered: false,
  });
  console.log("Inserted projects:", projectDocs.length);

  const tasks = Array.from({ length: 8 }).map(() => ({
    projectId: rand(projectDocs)._id,
    title: faker.company.name(),
    description: faker.lorem.sentence(),
    status: rand(["todo", "in-progress", "blocked"]),
    assignedTo: rand(userDocs)._id,
  }));
  const taskDocs = await TaskModel.insertMany(tasks, { ordered: false });
  console.log("Inserted taskDocs:", taskDocs.length);

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
