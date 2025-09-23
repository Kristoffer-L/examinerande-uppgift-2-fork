import express from "express";
import mongoose from "mongoose";
import {
  createProject,
  findProjects,
  findProject,
  updateProject,
  deleteProject,
  assignTaskToProject,
} from "../db/projectCrud.js";
import type { Request, Response } from "express";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", auth, async (req: Request, res: Response) => {
  console.log("Request user:", req.user?.userId);
  if (!req.user?.userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  if (!mongoose.isValidObjectId(req.user.userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const newProject = await createProject(req.body, req.user.userId);
    res.status(201).json(newProject);
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
    const project = await findProjects();
    res.status(201).json(project);
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
    const project = await findProject(id);
    if (!project) return res.status(404).json({ error: "Project not found." });

    res.status(201).json(project);
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
    const updatedProject = await updateProject(id, req.body);

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(201).json(updatedProject);
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
    const deletedProject = await deleteProject(id);

    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(201).json(deletedProject);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.put("/assign/:id", async (req: Request, res: Response) => {
  const projectId = req.params.id;
  const taskId = req.body.taskId;

  if (!projectId) {
    return res.status(400).json({ error: "projectId is required" });
  }
  if (!taskId) {
    return res.status(400).json({ error: "taskId is required" });
  }

  if (!mongoose.isValidObjectId(projectId)) {
    return res.status(400).json({ error: "Invalid ProjectId" });
  }
  if (!mongoose.isValidObjectId(taskId)) {
    return res.status(400).json({ error: "Invalid TaskId" });
  }

  try {
    const updatedTask = await assignTaskToProject(projectId, taskId);

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
