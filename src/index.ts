import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";
const DB_NAME = process.env.DB_NAME || "test";
const CLUSTER_NAME = process.env.CLUSTER_NAME || "Cluster0";

if (!MONGO_URI) throw new Error("MONGO_URI not found in .env");
if (!DB_NAME) throw new Error("DB_NAME not found in .env");

mongoose
  .connect(MONGO_URI, { dbName: DB_NAME, appName: CLUSTER_NAME })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.use("/user", userRoutes);
app.use("/task", taskRoutes);
app.use("/project", projectRoutes);
app.use("/auth", authRoutes);
