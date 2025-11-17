// src/routes/userRoutes.ts
import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth"; // ✅ use JWT middlewares
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const userRouter = express.Router();

// Option A: protect the whole router, then gate admin-only endpoints
userRouter.use(requireAuth);

userRouter.get("/", requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { id: "asc" },
  });
  res.json(users);
});

userRouter.get("/lite", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
  res.json(users);
});

userRouter.get("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});
