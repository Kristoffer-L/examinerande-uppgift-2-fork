import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: { userId: string; email: string } | jwt.JwtPayload; // Refine this based on your JWT payload
  }
}

function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req?.headers["authorization"] || "";
    const [scheme, token] = authHeader.split(" ");

    console.log(scheme, token);

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Invalid or missing header" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof payload === "string") {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = payload;
    console.log("Authenticated user:", req.user);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default auth;
