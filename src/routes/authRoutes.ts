import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signinUser } from "../db/authCrud.js";

const router = express.Router();

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await signinUser(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password2" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Sign in successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

export default router;
