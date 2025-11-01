// src/routes/userRoutes.ts
import express from "express";
import { prisma } from "../db";
import { requireAdmin, withUser } from "../middleware/auth";

export const userRouter = express.Router();

// public (authenticated) lite list for selectors
userRouter.get("/lite", withUser, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
  res.json(users);
});

// Full list (admin only)
userRouter.get("/", requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { id: "asc" },
  });
  res.json(users);
});
