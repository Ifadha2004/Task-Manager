import express from "express";
import { prisma } from "../db";
import { requireAdmin } from "../middleware/auth";

export const userRouter = express.Router();

userRouter.get("/", requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  res.json(users);
});
