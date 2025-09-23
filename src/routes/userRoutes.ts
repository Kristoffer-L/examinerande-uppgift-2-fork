import express from "express";
import mongoose from "mongoose";
import {
  createUser,
  findUsers,
  findUser,
  updateUser,
  deleteUser,
} from "../db/userCrud.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await createUser({
      ...rest,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (err) {
    if (err instanceof Error) {
      if ("code" in err && (err as any).code === 11000) {
        return res.status(409).json({ error: "E-mail or name exist already." });
      }
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});
router.get("/", async (req: Request, res: Response) => {
  try {
    const user = await findUsers();
    res.status(201).json(user);
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
    const user = await findUser(id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(201).json(user);
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
    const updatedUser = await updateUser(id, req.body);
    res.status(201).json(updatedUser);
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
    const deletedUser = await deleteUser(id);
    res.status(201).json(deletedUser);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

export default router;
