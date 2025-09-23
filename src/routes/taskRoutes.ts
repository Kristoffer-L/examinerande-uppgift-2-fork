import express from "express";
import mongoose from "mongoose";
import {
  createTask,
  findTasks,
  findTask,
  updateTask,
  deleteTask,
  statusChangeTask,
  assignedTask,
} from "../db/taskCrud.js";
import type { Request, Response } from "express";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/:projectId", async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  if (!projectId) {
    return res.status(400).json({ error: "Project ID is required" });
  }
  try {
    const newTask = await createTask(req.body, projectId);
    res.status(201).json(newTask);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  }
});
router.get("/", async (req: Request, res: Response) => {
  try {
    const task = await findTasks();
    res.status(201).json(task);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const task = await findTask(id);
    if (!task) return res.status(404).json({ error: "Task not found." });

    res.status(201).json(task);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
router.put("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const updatedTask = await updateTask(id, req.body);
    if (!updatedTask) return res.status(404).json({ error: "Task not found." });

    res.status(201).json(updatedTask);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const deletedTask = await deleteTask(id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found." });

    res.status(201).json(deletedTask);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.put("/status/:id", auth, async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.userId;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  try {
    const doneStatus = req.body.status === "done" ? new Date() : null;
    const doneUserId = req.body.status === "done" ? userId : null;
    const updatedTask = await statusChangeTask(
      id,
      req.body.status,
      doneStatus,
      doneUserId
    );

    res.status(201).json(updatedTask);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.put("/assign/:id", async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const userId = req.body.userId;

  if (!taskId) {
    return res.status(400).json({ error: "taskId is required" });
  }
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  if (!mongoose.isValidObjectId(taskId)) {
    return res.status(400).json({ error: "Invalid TaskID" });
  }
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: "Invalid UserID" });
  }

  try {
    const updatedTask = await assignedTask(taskId, userId);

    res.status(201).json(updatedTask);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

export default router;
