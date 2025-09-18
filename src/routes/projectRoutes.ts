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
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newProject = await createProject(req.body);
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
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
  const id = req.params.id;
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
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const updatedProject = await updateProject(id, req.body);
    if (!updatedProject)
      return res.status(404).json({ error: "Project not found." });

    res.status(201).json(updatedProject);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const deletedProject = await deleteProject(id);
    if (!deletedProject)
      return res.status(404).json({ error: "Project not found." });

    res.status(201).json(deletedProject);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

router.put("/assign/:id", async (req, res) => {
  const projectId = req.params.id;
  const taskId = req.body.taskId;
  if (!taskId) {
    return res.status(400).json({ error: "userId is required" });
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
